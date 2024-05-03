import { DomainError } from 'src/common/error/domain.error';
import { IAuthTokenManager } from 'src/security/auth.token.manager';
import { IPasswordHash } from 'src/security/password.hash';
import { IUserRepository } from './repositories/user.repository.interface';

interface LoginIn {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  userId: number;
}

export class AuthError extends DomainError {
  public readonly code: number;
  constructor(message: string) {
    super(message, 401);
  }
}

export class AuthService {
  private readonly userRepository: IUserRepository;
  private readonly passworHash: IPasswordHash;
  private readonly tokenManager: IAuthTokenManager;

  constructor(deps: {
    passwordHash: IPasswordHash;
    userRepository: IUserRepository;
    tokenManager: IAuthTokenManager;
  }) {
    this.passworHash = deps.passwordHash;
    this.userRepository = deps.userRepository;
    this.tokenManager = deps.tokenManager;
  }

  async login(payload: LoginIn) {
    const user = await this.userRepository.findOneByEmail(
      payload.email.toLowerCase(),
    );

    if (user == null) {
      throw new AuthError('email or password is wrong');
    }

    const isMatch = await this.passworHash.compare(
      payload.password,
      user.password,
    );

    if (!isMatch) {
      throw new AuthError('email or password is wrong');
    }

    const tokenPayload: AuthTokenPayload = {
      userId: user.id,
    };

    const token = await this.tokenManager.createAccessToken(tokenPayload);

    return token;
  }
}
