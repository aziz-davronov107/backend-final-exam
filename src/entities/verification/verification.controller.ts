import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EverifationsTypes } from 'src/common/types/verification';
import { SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import { Public } from 'src/core/decorators/publick.decorator';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @ApiOperation({
    description: `Valid types:
    ${EverifationsTypes.REGISTER},
    ${EverifationsTypes.RESET_PASSWORD},
    ${EverifationsTypes.EDIT_PHONE}`,
  })
  @Post('send')
  @Public()
  sendOtp(@Body() body: SendOtpDto) {
    return this.verificationService.sendOtp(body);
  }
  @Post('verify')
  @Public()
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.verificationService.verifyOtp(body);
    
  }
}
