import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthControler } from './auth.controler';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [VerificationModule],
  controllers: [AuthControler],
  providers: [AuthService],
})
export class AuthModule {}
