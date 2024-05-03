import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentConfigModule } from './infrastructures/config/environment-config/environment-config.module';
import { SecurityConfigModule } from './infrastructures/config/security/security-config.module';
import { TypeormConfigModule } from './infrastructures/config/typeorm/typeorm.module';
import { UserModule } from './presentations/user/user.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeormConfigModule,
    SecurityConfigModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
