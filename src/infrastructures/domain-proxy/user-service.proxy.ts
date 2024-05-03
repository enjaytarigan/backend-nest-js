import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from 'src/user/auth.service';
import { UserService } from 'src/user/user.service';
import { RepositoriesModule } from '../repositories/repositories.module';
import { UserRepositoryOrm } from '../repositories/user.repository';
import { PasswordHash } from '../config/security/password.hash';
import { SecurityConfigModule } from 'src/infrastructures/config/security/security-config.module';
import { DomainServiceProxy } from './domain.proxy';
import { JwtTokenManager } from '../config/security/jwt.token.manager';

@Module({
  imports: [RepositoriesModule, SecurityConfigModule],
})
export class UserServiceProxyModule {
  static USER_SERVICE = 'userServiceProxy';
  static AUTH_USER_SERVICE = 'authUserServiceProxy';
  static register(): DynamicModule {
    return {
      module: UserServiceProxyModule,
      providers: [
        {
          inject: [UserRepositoryOrm, PasswordHash, JwtTokenManager],
          provide: UserServiceProxyModule.USER_SERVICE,
          useFactory(
            userRepository: UserRepositoryOrm,
            passwordHash: PasswordHash,
          ) {
            return new DomainServiceProxy(
              new UserService(userRepository, passwordHash),
            );
          },
        },
        {
          inject: [UserRepositoryOrm, PasswordHash, JwtTokenManager],
          provide: UserServiceProxyModule.AUTH_USER_SERVICE,
          useFactory(
            userRepository: UserRepositoryOrm,
            passwordHash: PasswordHash,
            tokenManager: JwtTokenManager,
          ) {
            return new DomainServiceProxy(
              new AuthService({
                userRepository,
                passwordHash,
                tokenManager,
              }),
            );
          },
        },
      ],
      exports: [
        UserServiceProxyModule.USER_SERVICE,
        UserServiceProxyModule.AUTH_USER_SERVICE,
      ],
    };
  }
}
