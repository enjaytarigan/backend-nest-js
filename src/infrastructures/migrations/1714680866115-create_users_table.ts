import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1714680866115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          { name: 'name', type: 'varchar(100)', isNullable: false },
          {
            name: 'email',
            type: 'varchar(100)',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'profile_pic_url',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
            isNullable: false,
          },
          { name: 'created_by', type: 'int', isNullable: true },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
