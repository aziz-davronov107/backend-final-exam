import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMobilePhone, IsString } from 'class-validator';
import { EverifationsTypes } from 'src/common/types/verification';

export class SendOtpDto {
  @ApiProperty({
    enum: EverifationsTypes,
  })
  @IsEnum(EverifationsTypes)
  type: EverifationsTypes;
  @ApiProperty({
    example: '+998905341009',
  })
  @IsString()
  phone: string;
}
export class VerifyOtpDto extends SendOtpDto {
  @ApiProperty({
    example: '000000',
  })
  @IsString()
  otp: string;
}
