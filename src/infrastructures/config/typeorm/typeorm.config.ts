import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config();

function getDataSourceOptions() {
  const dataSource: DataSourceOptions = {
    type: 'postgres',
    database: process.env.PG_DATABASE,
    port: Number(process.env.PG_PORT),
    host: process.env.PG_HOST,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    migrations: [__dirname + './../../migrations/**/*{.ts,.js}'],
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    synchronize: false,
  };

  return dataSource;
}

const dataSource = new DataSource(getDataSourceOptions());

export default dataSource;
