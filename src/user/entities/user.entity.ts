import { DomainError } from 'src/common/error/domain.error';

export class InvalidUserNameError extends Error {
  constructor() {
    super('name must be a non empty string');
  }
}

export class InvalidUserEmailError extends Error {
  constructor() {
    super('email must be a valid email');
  }
}

export enum UserErrorType {
  NAME = 'name must be a non empty string',
  EMAIL = 'email must be a valid email',
  PROFILE_PIC_URL = 'profilePicUrl must be a valid url',
  EMAIL_ALREADY_REGISTERED = 'email already registered',
  NOT_FOUND = 'user not found',
  PASSWORD_TOO_SHORT = 'password must be a string with min 5 characters',
}

export class UserError extends DomainError {
  constructor(
    public type: UserErrorType,
    public code: number = 400,
  ) {
    super(type, code);
  }
}

export class User {
  public id: number;
  public name: string;
  public email: string;
  private _password: string;
  public profilePicUrl: string;

  // if it's not null, then user created by other user
  public createdBy: number | null;
  constructor({
    id,
    name,
    email,
    profilePicUrl,
    createdBy,
    password,
  }: {
    id: number;
    name: string;
    email: string;
    profilePicUrl: string;
    createdBy: number | null;
    password: string;
  }) {
    if (name == null || name == '') {
      throw new UserError(UserErrorType.NAME);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email == null || !emailRegex.test(email)) {
      throw new UserError(UserErrorType.EMAIL);
    }

    if (profilePicUrl == null || profilePicUrl == '') {
      throw new UserError(UserErrorType.PROFILE_PIC_URL);
    }

    this.id = id;
    this.email = email.toLowerCase();
    this.name = name;
    this.profilePicUrl = profilePicUrl;
    this.createdBy = createdBy;
    this._password = password;
  }

  static Create(user: {
    name: string;
    email: string;
    profilePicUrl: string;
    password: string;
  }) {
    return new User({ ...user, id: 0, createdBy: null });
  }

  addUser(user: {
    name: string;
    email: string;
    profilePicUrl: string;
    password: string;
  }) {
    return new User({ ...user, createdBy: this.id, id: 0 });
  }

  public get password() {
    return this._password;
  }
}
