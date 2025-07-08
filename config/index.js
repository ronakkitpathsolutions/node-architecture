import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://username:password@localhost:5432/database_name',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
  HASH_SALT_ROUNDS: parseInt(process.env.HASH_SALT_ROUNDS, 10) || 10,
};
