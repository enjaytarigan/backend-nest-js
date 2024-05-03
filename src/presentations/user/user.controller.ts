import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  AuthGuard,
  IAuthRequest,
} from 'src/infrastructures/config/security/auth.guard';
import { DomainServiceProxy } from 'src/infrastructures/domain-proxy/domain.proxy';
import { UserServiceProxyModule } from 'src/infrastructures/domain-proxy/user-service.proxy';
import { UserService } from 'src/user/user.service';
import { CreateUserDto, CreateUserDtoOut } from './dto/user-create.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserServiceProxyModule.USER_SERVICE)
    private readonly userService: DomainServiceProxy<UserService>,
  ) {}

  @Post()
  async createUser(@Body() dtoIn: CreateUserDto) {
    const user = await this.userService.getInstance().create(dtoIn);

    return {
      code: HttpStatus.CREATED,
      data: new CreateUserDtoOut(user.id),
    };
  }

  @UseGuards(AuthGuard)
  @Post('/add')
  async addUser(@Body() dtoIn: CreateUserDto, @Req() req: IAuthRequest) {
    const user = await this.userService
      .getInstance()
      .addUser(dtoIn, req.user.userId);

    return {
      code: HttpStatus.CREATED,
      data: new CreateUserDtoOut(user.id),
    };
  }
}
