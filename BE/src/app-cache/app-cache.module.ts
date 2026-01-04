// cache.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        });

        return {
          store,
          ttl: 0,
          isCacheableValue: (v) =>
            v !== undefined && v !== null && !(v instanceof Error),
        };
      },
      isGlobal: true,
    }),
  ],
})
export class AppCacheModule { }
