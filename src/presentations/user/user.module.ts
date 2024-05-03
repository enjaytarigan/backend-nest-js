import { Module } from '@nestjs/common';
import { SecurityConfigModule } from 'src/infrastructures/config/security/security-config.module';
import { UserServiceProxyModule } from 'src/infrastructures/domain-proxy/user-service.proxy';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';

@Module({
  imports: [UserServiceProxyModule.register(), SecurityConfigModule],
  controllers: [UserController, AuthController],
})
export class UserModule {}
