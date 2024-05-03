import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHash } from 'src/security/password.hash';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';

@Injectable()
export class PasswordHash implements IPasswordHash {
  constructor(private config: EnvironmentConfigService) {}

  async hash(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(this.config.getBcryptSalt()));
    return bcrypt.hash(plainPassword, salt);
  }

  compare(plainPassword: string, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, encryptedPassword);
  }
}
