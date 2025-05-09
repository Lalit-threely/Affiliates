

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET!,
  sentryDSN: process.env.SENTRY_DSN,
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  email: {
    postmarkKey: process.env.POSTMARK_API_KEY,
  },
  redis: {
    read: {
      url: process.env.REDIS_READ_HOST!,
      port: Number(process.env.REDIS_READ_PORT)
    },
    write: {
      url: process.env.REDIS_WRITE_HOST!,
      port: Number(process.env.REDIS_WRITE_PORT)
    }
  }
};


export const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  /http.*\.vercel\.app$/i,
];
