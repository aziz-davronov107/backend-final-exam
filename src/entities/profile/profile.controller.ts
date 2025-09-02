import { Controller, Get, Patch, Put, Post, Body, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProfileUpdateDto } from './dto/update.profile.dto';
import { Roles } from 'src/core/decorators/role.decorator';

@Controller('my')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  getProfile(@Req() req: Request) {
    return this.profileService.getProfile(req.user);
  }

   @UseInterceptors(
          FileFieldsInterceptor([
              { name: 'avatar', maxCount: 1 },
          ]),
    )
  @Patch('profile')
  @Roles('MENTOR','ADMIN','STUDENT','ASSISTANT')
  updateProfile( @Req() req: Request,@Body() dto:ProfileUpdateDto, @UploadedFiles() files?: {  avatar?: Express.Multer.File[];  },) {
    const avatarFile = files?.avatar?.[0];
    const avatarUrl = avatarFile ? `${process.env.STATIC_URL}/avatar/${avatarFile.filename}` : null;

    return this.profileService.updateProfile(req.user ,{fullName: dto.fullName, image:avatarUrl});
  }

  @Get('last-activity')
  getLastActivity(@Req() req: Request) {
    return this.profileService.getLastActivity(req.user);
  }

  @Put('last-activity')
  updateLastActivity(@Req() req: Request, @Body() dto: any) {
    return this.profileService.updateLastActivity(req.user, dto);
  }

  @Post('phone/update')
  updatePhone(@Body() dto: any, @Req() req: Request) {
    return this.profileService.updatePhone(req.user, dto);
  }

  @Patch('password/update')
  updatePassword(@Body() dto: any, @Req() req: Request) {
    return this.profileService.updatePassword(req.user, dto);
  }

  @Patch('mentor-profile')
  updateMentorProfile(@Body() dto: any, @Req() req: Request) {
    return this.profileService.updateMentorProfile(req.user, dto);
  }
}
