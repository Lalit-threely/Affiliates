import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
const session = require('express-session');
import { RedisStore } from 'connect-redis';
import { redisClient } from './utils/redis';
import { sequelize } from './models/index';
import affiliateRoutes from './routes/affiliate';
import authRoutes from './routes/auth';
import config from './config';
import { allowedOrigins } from './controllers';

dotenv.config();

const app = express();
app.use(express.json());
const {env, port, sessionSecret } = config;

// Use Redis cluster as the session store
const redisStore = new RedisStore({ client: redisClient });

// Middleware
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Cookie', 'Authorization'],
  exposedHeaders: ['dapp', 'Set-Cookie'],
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up express-session middleware
app.set('trust proxy', 1);

app.use(
  session({
    store: redisStore,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,

    cookie: {
      // domain: '.tria.so',
      path: '/',
      httpOnly: true,
      secure: env !== 'development' ? true : false, 
      sameSite: env === 'development' ? 'none' : 'lax', 
      priority: 'high',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    //name: '__Host-sid' // session cookie name
  })
);

// Routes
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Database connection and server start
const startServer = async () => {
  try {
    console.log('Starting server...');
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database models
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized.');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer(); 