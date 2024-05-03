import { Body, Controller, Inject, Post } from '@nestjs/common';
import { DomainServiceProxy } from 'src/infrastructures/domain-proxy/domain.proxy';
import { UserServiceProxyModule } from 'src/infrastructures/domain-proxy/user-service.proxy';
import { AuthService } from 'src/user/auth.service';
import { AuthLoginDtoIn } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UserServiceProxyModule.AUTH_USER_SERVICE)
    private authService: DomainServiceProxy<AuthService>,
  ) {}

  @Post('/login')
  async login(@Body() dtoIn: AuthLoginDtoIn) {
    const token = await this.authService.getInstance().login(dtoIn);

    return {
      message: 'success',
      data: {
        accessToken: token,
      },
    };
  }
}
