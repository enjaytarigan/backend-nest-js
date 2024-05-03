import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config.service';

function getConfigFilePath() {
  switch (process.env.NODE_ENV) {
    case 'development':
    case 'production':
      return '.env';
    case 'test':
      return '.test.env';
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getConfigFilePath(),
      isGlobal: true,
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
