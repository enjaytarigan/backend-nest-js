import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/infrastructures/models/user.model';
import { User } from 'src/user/entities/user.entity';
import { IUserRepository } from 'src/user/repositories/user.repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepositoryOrm implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async insert(user: User): Promise<User> {
    const nUser = this.userRepository.create({
      name: user.name,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      createdBy: user.createdBy,
      password: user.password,
    });

    const { identifiers } = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(UserModel)
      .values(nUser)
      .returning(['id'])
      .execute();

    nUser.id = identifiers[0].id;

    return new User(nUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicUrl: true,
        createdAt: true,
        createdBy: true,
        password: true,
      },
    });

    if (user == null) {
      return Promise.resolve(null);
    }

    return new User(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (user == null) {
      return Promise.resolve(null);
    }

    return new User(user);
  }
}
