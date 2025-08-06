import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  user: process.env.DATABASE_USER,
  name: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  synchronize: process.env.DATABASE_SYNC === 'true',
  autoloadEntities: process.env.DATABASE_AUTOLOAD_ENTITIES === 'true',
  ssl: process.env.DATABASE_SSL === 'true',
}));
