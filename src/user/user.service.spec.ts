import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { IPasswordHash } from 'src/security/password.hash';
import { User, UserError, UserErrorType } from './entities/user.entity';
import { IUserRepository } from './repositories/user.repository.interface';
import { CreateUserIn, UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: DeepMocked<IUserRepository>;
  let passwordHash: DeepMocked<IPasswordHash>;

  beforeEach(async () => {
    passwordHash = createMock<IPasswordHash>();
    userRepository = createMock<IUserRepository>();
    service = new UserService(userRepository, passwordHash);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should orchestrating the create user flow correctly', async () => {
      const payload: CreateUserIn = {
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        password: 'dummypassword',
      };

      const expectedResult: User = new User({
        id: 1,
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        createdBy: null,
        password: 'dummypassword',
      });

      userRepository.insert.mockReturnValue(Promise.resolve(expectedResult));
      userRepository.findOneByEmail.mockReturnValue(Promise.resolve(null));
      passwordHash.hash.mockReturnValue(Promise.resolve('hashedpassword'));

      const result = await service.create(payload);

      expect(result).toStrictEqual(expectedResult);
      expect(userRepository.insert).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(payload.email);
      expect(passwordHash.hash).toHaveBeenCalledWith(payload.password);
    });

    it('should throw error when email is already registered', async () => {
      const payload: CreateUserIn = {
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        password: 'dummypassword',
      };

      const expectedResult: User = new User({
        id: 1,
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        createdBy: null,
        password: 'dummypassword',
      });

      userRepository.findOneByEmail.mockReturnValue(
        Promise.resolve(expectedResult),
      );

      await expect(service.create(payload)).rejects.toThrow(
        UserErrorType.EMAIL_ALREADY_REGISTERED,
      );
    });
  });

  describe('addUser', () => {
    it('should throw error when creator userId is not found in database', async () => {
      const payload: CreateUserIn = {
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        password: 'dummypassword',
      };

      userRepository.findById.mockReturnValue(Promise.resolve(null));

      await expect(
        service.addUser(payload, Math.ceil(100 * Math.random())),
      ).rejects.toThrow(UserErrorType.NOT_FOUND);
    });

    it('should throw error when email is already registered', async () => {
      // Arrange
      const userId = Math.ceil(10 * Math.random());

      const payload: CreateUserIn = {
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        password: 'dummypassword',
      };

      const expectedResult: User = new User({
        id: 1,
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        createdBy: null,
        password: 'dummypassword',
      });

      // Act
      userRepository.findById.mockReturnValue(
        Promise.resolve(
          new User({
            id: userId,
            name: 'creator',
            email: 'creator@mail.com',
            profilePicUrl: 'example',
            createdBy: null,
            password: 'dummypassword',
          }),
        ),
      );
      userRepository.findOneByEmail.mockReturnValue(
        Promise.resolve(expectedResult),
      );

      // Assert
      await expect(service.addUser(payload, userId)).rejects.toThrow(
        UserErrorType.EMAIL_ALREADY_REGISTERED,
      );
    });

    it('should return new user with valid createdBy', async () => {
      const userId = Math.ceil(10 * Math.random());

      const payload: CreateUserIn = {
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        password: 'dummypassword',
      };

      const expectedResult: User = new User({
        id: 1,
        name: 'john doe',
        email: 'john@example.com',
        profilePicUrl: 'random.image.com',
        createdBy: userId,
        password: 'dummypassword',
      });

      userRepository.insert.mockReturnValue(Promise.resolve(expectedResult));
      userRepository.findOneByEmail.mockReturnValue(Promise.resolve(null));
      userRepository.findById.mockReturnValue(
        Promise.resolve(
          new User({
            id: userId,
            email: 'create@mail.com',
            name: 'John Creator',
            profilePicUrl: 'www.example.com',
            createdBy: null,
            password: 'dummypassword',
          }),
        ),
      );

      const result = await service.addUser(payload, userId);

      expect(result).toStrictEqual(expectedResult);
      expect(expectedResult.createdBy).toEqual(userId);
      expect(userRepository.insert).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneByEmail).toHaveBeenCalledWith(payload.email);
    });
  });
});
