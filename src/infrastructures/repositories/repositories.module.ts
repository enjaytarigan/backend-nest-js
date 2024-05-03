import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../models/user.model';
import { UserRepositoryOrm } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [UserRepositoryOrm],
  exports: [UserRepositoryOrm],
})
export class RepositoriesModule {}
