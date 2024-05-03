import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenManager } from './jwt.token.manager';
import { AuthTokenPayload } from 'src/user/auth.service';

export interface IAuthRequest extends Request {
  user: AuthTokenPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenManager: JwtTokenManager) {}

  async canActivate(context: ExecutionContext) {
    const req = this.getRequest(context);
    const token = this.getToken(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.tokenManager.verifyToken<AuthTokenPayload>(token);

      req['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  protected getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest<IAuthRequest>();
  }

  protected getToken(req: IAuthRequest) {
    const auth = req.headers['authorization'];

    if (!auth || Array.isArray(auth)) {
      throw new UnauthorizedException();
    }

    // authorization => 'Bearer {token}'
    const token = auth.split('Bearer ')[1];

    return token;
  }
}
