import { IPasswordHash } from 'src/security/password.hash';
import { User, UserError, UserErrorType } from './entities/user.entity';
import { IUserRepository } from './repositories/user.repository.interface';

export interface CreateUserIn {
  name: string;
  email: string;
  profilePicUrl: string;
  password: string;
}

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private passwordHash: IPasswordHash,
  ) {}

  private validatePassword(password: string) {
    const MIN_LENGTH = 8;

    if (typeof password != 'string') {
      throw new UserError(UserErrorType.PASSWORD_TOO_SHORT);
    }

    if (password.length < MIN_LENGTH) {
      throw new UserError(UserErrorType.PASSWORD_TOO_SHORT);
    }
  }

  // create creates new user
  async create(payload: CreateUserIn) {
    this.validatePassword(payload.password);

    const encryptedPassword = await this.passwordHash.hash(payload.password);

    const nUser = User.Create({ ...payload, password: encryptedPassword });

    await this.checkEmailExists(nUser.email);

    return this.userRepository.insert(nUser);
  }

  // addUser creates new user by other user
  async addUser(userIn: CreateUserIn, userId: number) {
    this.validatePassword(userIn.password);

    const user = await this.userRepository.findById(userId);

    if (user == null) {
      throw new UserError(UserErrorType.NOT_FOUND);
    }

    const encryptedPassword = await this.passwordHash.hash(userIn.password);

    const nUser = user.addUser({ ...userIn, password: encryptedPassword });

    await this.checkEmailExists(nUser.email);

    return this.userRepository.insert(nUser);
  }

  private async checkEmailExists(email: string) {
    const userByEmail = await this.userRepository.findOneByEmail(
      email.toLowerCase(),
    );

    if (userByEmail != null) {
      throw new UserError(UserErrorType.EMAIL_ALREADY_REGISTERED);
    }
  }
}
