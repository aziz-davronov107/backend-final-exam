import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { MyRedisService } from './redis.service';

@Module({
  providers: [MyRedisService],
  exports: [MyRedisService],
})
export class MyRedisModel {}
