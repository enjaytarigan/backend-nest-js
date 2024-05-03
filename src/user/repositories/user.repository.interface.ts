import { User } from '../entities/user.entity';

export interface IUserRepository {
  insert(user: User): Promise<User>;
  findOneByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
}
