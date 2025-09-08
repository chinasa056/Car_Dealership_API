import { getRedisClient } from './redis';

const client = () => getRedisClient();

export const setCache = async (key: string, data: any, ttl: number = 300) => {
  if (process.env.NODE_ENV === 'test' && process.env.SKIP_REDIS_IN_TEST === 'true') {
    return;
  }
  await client().set(key, JSON.stringify(data), 'EX', ttl);
};

export const getCache = async (key: string) => {
  if (process.env.NODE_ENV === 'test' && process.env.SKIP_REDIS_IN_TEST === 'true') {
    return null;
  }
  const cached = await client().get(key);
  return cached ? JSON.parse(cached) : null;
};

export const deleteCache = async (key: string) => {
  if (process.env.NODE_ENV === 'test' && process.env.SKIP_REDIS_IN_TEST === 'true') {
    return;
  }
  await client().del(key);
};

export const cacheExpiry = async (key: string, ttl: number) => {
  if (process.env.NODE_ENV === 'test' && process.env.SKIP_REDIS_IN_TEST === 'true') {
    return;
  }
  await client().expire(key, ttl);
}