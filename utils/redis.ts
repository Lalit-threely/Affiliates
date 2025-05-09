import Redis from "ioredis";
import config from '../config';


const { redis } = config;

export const redisClient = new Redis({ host: redis.write.url, port: redis.write.port });