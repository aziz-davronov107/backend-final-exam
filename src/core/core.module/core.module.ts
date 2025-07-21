import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../db/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MyRedisModel } from 'src/common/redis/redis.model';
import { SmsService } from 'src/common/services/sms.service';
import { AccessJwtStrategy } from '../strategy/access.strategy';
import { RefreshTokenGuard } from '../guards/refresh_guard';
import { RefreshJwtStrategy } from '../strategy/refresh.strategy';
import { AccessTokenGuard } from '../guards/auth-guards';

@Global()
@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.register({
      secret: 'yandiev',
      signOptions: { expiresIn: '1h' },
    }),
    MyRedisModel
  ],
  providers: [SmsService,AccessJwtStrategy,AccessTokenGuard,RefreshTokenGuard,RefreshJwtStrategy],
  exports: [PassportModule, PrismaModule, JwtModule,SmsService,MyRedisModel],
})
export class CoreModule {}
