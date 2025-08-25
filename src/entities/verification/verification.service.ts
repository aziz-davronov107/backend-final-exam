import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import { EverifationsTypes, ICheckOtp } from 'src/common/types/verification';
import { PrismaService } from 'src/core/db/prisma.service';
import { generateOtp } from 'src/common/utils/random';
import { SmsService } from 'src/common/services/sms.service';
import { MyRedisService } from 'src/common/redis/redis.service';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
    private redis: MyRedisService,
  ) {}
  private getMessage(type: EverifationsTypes, otp: string) {
    switch (type) {
      case EverifationsTypes.REGISTER:
        
        return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
      case EverifationsTypes.RESET_PASSWORD:
        return `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
      case EverifationsTypes.EDIT_PHONE:
        return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
    }
  }
  private async throwIfUserExists(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });
    if (user) {
      throw new HttpException('Phone already used', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
  private async throwIfUserNotExists(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  public getKey(
    type: EverifationsTypes,
    phone: string,
    confirmation?: boolean,
  ) {
    const storeKeys: Record<EverifationsTypes, string> = {
      [EverifationsTypes.REGISTER]: 'reg_',
      [EverifationsTypes.RESET_PASSWORD]: 'respass_',
      [EverifationsTypes.EDIT_PHONE]: 'edph_',
    };
    let key = storeKeys[type];
    if (confirmation) {
      key += 'cfm_';
    }
    key += phone;
    return key;
  }
  async sendOtp(payload: SendOtpDto) {
    const { type, phone } = payload;
    const key = this.getKey(type, phone);
    const session = await this.redis.get(key);
    if (session) {
      throw new HttpException(
        'Code already sent to user',
        HttpStatus.BAD_REQUEST,
      );
    }
    switch (type) {
      case EverifationsTypes.REGISTER:
        await this.throwIfUserExists(phone);
        break;
      case EverifationsTypes.EDIT_PHONE:
        await this.throwIfUserNotExists(phone);
        break;
      case EverifationsTypes.RESET_PASSWORD:
        await this.throwIfUserNotExists(phone);
        break;
    }
    const otp = generateOtp();
    await this.redis.set(key, JSON.stringify({ otp }), 120);
    await this.smsService.sendSMS(this.getMessage(type, otp), phone);
    return { message: 'Confirmation code sent!' };
  }
  async verifyOtp(payload: VerifyOtpDto) {
    const { type, phone, otp } = payload;
    const session = await this.redis.get(this.getKey(type, phone));
    if (!session) {
      throw new HttpException('OTP expired!', HttpStatus.BAD_REQUEST);
    }
    if (otp !== JSON.parse(session).otp) {
      throw new HttpException('Invalide OTP', HttpStatus.BAD_REQUEST);
    }
    await this.redis.delete(this.getKey(type, phone));

    await this.redis.set(
      this.getKey(type, phone, true),
      JSON.stringify({ otp }),
      300,
    );

    return {
      success: true,
      message: 'Verified',
    };
  }

  public async checkConfigOtp(payload: ICheckOtp) {
    const { type, phone, otp } = payload;
    const session = await this.redis.get(this.getKey(type, phone, true));
    if (!session) {
      throw new HttpException('OTP expired!', HttpStatus.BAD_REQUEST);
    }
    if (otp !== JSON.parse(session).otp) {
      throw new HttpException('Invalide OTP', HttpStatus.BAD_REQUEST);
    }
    await this.redis.delete(this.getKey(type, phone));
    return true;
  }
}
