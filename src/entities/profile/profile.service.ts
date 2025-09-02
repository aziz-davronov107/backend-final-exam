import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/db/prisma.service';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class ProfileService {
    constructor(
        private prisma: PrismaService,
        private verificationService: VerificationService,
      ) {}
  getProfile(user: any) {
    return { message: 'Profile data', user };
  }

  async updateProfile(user: any,dto: any) {
    let exist_user = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!exist_user) {
      throw new Error('User not found');
    }
    const data: any = {};
    if (dto.fullName) data.fullName = dto.fullName;
    if (dto.image) data.image = dto.image;

    await this.prisma.user.update({
      where: { id: user.id },
      data:dto,
    }); 
    return { message: 'Profile updated'};
  }

  getLastActivity(user: any) {
    return { message: 'Last activity data', user };
  }

  updateLastActivity(user: any, dto: any) {
    return { message: 'Last activity updated', user, dto };
  }

  updatePhone(user: any, dto: any) {
    return { message: 'Phone update (OTP verification needed)', user, dto };
  }

  updatePassword(user: any, dto: any) {
    return { message: 'Password updated', user, dto };
  }

  updateMentorProfile(user: any, dto: any) {
    return { message: 'Mentor profile updated', user, dto };
  }
}
