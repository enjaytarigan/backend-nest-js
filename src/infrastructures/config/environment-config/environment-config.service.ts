import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('PG_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('PG_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('PG_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('PG_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('PG_DATABASE');
  }

  getAppPort(): number {
    return this.configService.get<number>('PORT');
  }

  getBcryptSalt(): number {
    return this.configService.get<number>('BCRYPT_SALT');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtTokenExpirationInMinutes(): number {
    return this.configService.get<number>('JWT_EXPIRATION_MINUTES');
  }
}
