import { User, UserErrorType } from './user.entity';

describe('User', () => {
  it('should throw an error when the name is empty', () => {
    expect(
      () =>
        new User({
          id: 0,
          name: '',
          email: 'johndoe@example.com',
          profilePicUrl: 'www.image.com',
          createdBy: null,
          password: 'dummy',
        }),
    ).toThrow(UserErrorType.NAME);
  });

  it('should throw an error when email is invalid', () => {
    expect(
      () =>
        new User({
          id: 0,
          name: 'john doe',
          email: 'invalid email',
          profilePicUrl: 'www.image.com',
          createdBy: null,
          password: 'dummy',
        }),
    ).toThrow(UserErrorType.EMAIL);
  });

  it('should throw an error when profilePicUrl is empty', () => {
    expect(
      () =>
        new User({
          id: 0,
          name: 'john doe',
          email: 'johndoe@example.com',
          profilePicUrl: '',
          createdBy: null,
          password: 'dummy',
        }),
    ).toThrow(UserErrorType.PROFILE_PIC_URL);
  });

  it('should return an user', () => {
    expect(
      () =>
        new User({
          id: 1,
          name: 'john doe',
          email: 'john@example.com',
          profilePicUrl: 'https://www.email.com',
          createdBy: null,
          password: 'dummy',
        }),
    );
  });

  describe('addUser', () => {
    it('should add a new user', () => {
      const user = new User({
        id: 1,
        name: 'john',
        email: 'john@mail.com',
        profilePicUrl: 'url',
        createdBy: null,
        password: 'dummy',
      });

      const payload = {
        name: 'user by john',
        email: 'userjohn@mail.com',
        profilePicUrl: 'url',
        password: 'dummy',
      };

      const nUser = user.addUser(payload);

      const expectedResult = new User({
        ...payload,
        createdBy: user.id,
        id: 0,
        password: 'dummy',
      });

      expect(nUser).toStrictEqual(expectedResult);
    });
  });
});
