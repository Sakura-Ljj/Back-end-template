import 'reflect-metadata';
import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'backend_template',
  synchronize: process.env.DB_SYNCHRONIZE !== 'false',
  logging: process.env.DB_LOGGING === 'true' ? ['error', 'warn'] : false,
  entities: [path.join(process.cwd(), 'src', 'modules', '*', 'entity', '*.entity.{ts,js}')],
  entityPrefix: process.env.DB_ENTITY_PREFIX || 'app_'
};

export const AppDataSource = new DataSource(dbConfig);