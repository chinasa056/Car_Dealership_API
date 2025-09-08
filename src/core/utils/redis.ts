import Redis, { RedisOptions } from 'ioredis';

let redisClientInstance: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClientInstance) {
    let redisConfig: RedisOptions;

    // Determine the Redis configuration based on the environment
    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv === 'development' || nodeEnv === 'test') {
      redisConfig = {
        host:  'localhost',
        port:  6379,
        // lazyConnect: true,
      };
    } else {
      // Use cloud Redis configuration for production or other environments
      redisConfig = {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
      };
    }

    // Create a new Redis instance with the chosen configuration
    redisClientInstance = new Redis(redisConfig);

    // Event handlers 
    redisClientInstance.on('connect', () => {
      console.log('Connected to Redis');
    });

    redisClientInstance.on('error', (err: any) => {
      console.log('Redis Client Error: ', err);
    });
  }

  return redisClientInstance;
}

export async function closeRedis(): Promise<void> {
  if (redisClientInstance) {
    await redisClientInstance.quit();
    redisClientInstance = null;
    console.log('Redis connection closed');
  }
}

export const redisClient = getRedisClient();