import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'affiliates_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  }
};

export default config;