import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/db/prisma.service';
import { VerificationService } from '../verification/verification.service';
import * as bcrypt from 'bcrypt';
import { CreateDto, LoginDto } from './dto/auth.dto';
import { EverifationsTypes } from 'src/common/types/verification';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private verificationService: VerificationService,
  ) {}
  async getToken(id: number, isTrue?: boolean) {
    let isRefresh = {
      secret: process.env.JWT_REFRESH_SECRET || 'yandiev',
      expiresIn: '7d',
    };
    if (!isTrue) {
      return {
        access_token: await this.jwtService.signAsync({ id }),
        refresh_token: await this.jwtService.signAsync({ id }, isRefresh),
      };
    }
    return {
      refresh_token: await this.jwtService.signAsync({ id }, isRefresh),
    };
  }

  async register(payload: CreateDto) {
    await this.verificationService.checkConfigOtp({
      type: EverifationsTypes.REGISTER,
      ...payload,
    });

    
    let { phone, password, fullName } = payload;
    const exists = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (exists) {
      throw new ConflictException('User already exists');
    }
    let hash = await bcrypt.hash(password, 10);
    const new_user = await this.prisma.user.create({
      data: { phone, password: hash, fullName },
    });
  
    const token = await this.getToken(new_user.id);
    console.log(token)
    return token;
  }
  async login(payload: LoginDto) {
    let user = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (!user || !(await bcrypt.compare(payload.password, user.password))) {
      throw new HttpException(
        'Phone or password Incorect',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = await this.getToken(user!.id);
    return token;
  }
  async refresh_token(id: number) {
    const token = await this.getToken(id, true);
    return token;
  }
}
