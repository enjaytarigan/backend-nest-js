import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserModel {
  @PrimaryColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'profile_pic_url', type: 'text' })
  profilePicUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'password', type: 'text', nullable: false })
  password: string;

  @Column({ name: 'created_by', type: 'integer', nullable: true })
  createdBy: number | null;
}
