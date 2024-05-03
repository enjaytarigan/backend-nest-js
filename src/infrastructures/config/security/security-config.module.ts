import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { AuthGuard } from './auth.guard';
import { JwtTokenManager } from './jwt.token.manager';
import { PasswordHash } from './password.hash';
@Module({
  imports: [
    EnvironmentConfigModule,
    JwtModule.registerAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (enviromentConfig: EnvironmentConfigService) => ({
        secret: enviromentConfig.getJwtSecret(),
        signOptions: {
          // 60000ms = 1 minute
          expiresIn: 60000 * enviromentConfig.getJwtTokenExpirationInMinutes(),
        },
        global: true,
      }),
    }),
  ],
  providers: [JwtTokenManager, PasswordHash, AuthGuard],
  exports: [JwtTokenManager, PasswordHash, AuthGuard],
})
export class SecurityConfigModule {}
