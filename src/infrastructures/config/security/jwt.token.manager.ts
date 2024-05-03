import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthTokenManager } from 'src/security/auth.token.manager';

@Injectable()
export class JwtTokenManager implements IAuthTokenManager {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken<Payload extends object = any>(
    payload: Payload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken<Payload extends object = any>(
    token: string,
  ): Promise<Payload> {
    return this.jwtService.verifyAsync<Payload>(token);
  }
}
