import { Injectable } from '@nestjs/common';
import Redis  from 'ioredis';

@Injectable()
export class MyRedisService {
  private client : Redis
  async onModuleInit(){
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
      password: 'yandiev'
    });
  }

  async set(key: string, value: string,second:number) {
    await this.client.set(key, value, 'EX', second);
  }

  async get(key: string){
    return this.client.get(key);
  }

  async delete(key: string){
    return this.client.del(key);
  }
}