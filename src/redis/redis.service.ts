import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private _redis: Redis;

  onModuleDestroy() {
    this._redis.disconnect();
  }

  onModuleInit() {
    this._redis = new Redis({ host: 'localhost', port: 6379 });
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this._redis.set(key, value, 'EX', ttl);
    } else {
      await this._redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this._redis.get(key);
  }

  async delete(key: string) {
    return this._redis.del(key);
  }
}
