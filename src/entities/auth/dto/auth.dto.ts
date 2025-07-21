import { 
  IsEnum,
  IsPhoneNumber,
  IsString 
} from "class-validator";
import { ApiProperty, PickType} from "@nestjs/swagger";
import { EverifationsTypes} from "src/common/types/verification";

export class CreateDto {
  @ApiProperty({
    description: "Telefon raqam (E.164 formatda, +998901234567 misolida)",
    example: "+998901234567"
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: "Parol (kamida 6 ta belgidan iborat)",
    example: "StrongP@ssw0rd"
  })
  @IsString()
  password: string;


  @ApiProperty({
    description: "Foydalanuvchining to‘liq ismi",
    example: "Azizbek Davronov"
  })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Tasdiqlash коди (OTP)' })
  @IsString()
  otp: string;
}

export class LoginDto extends PickType(CreateDto,['phone','password'] as const){ }