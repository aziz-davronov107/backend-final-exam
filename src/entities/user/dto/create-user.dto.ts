import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsInt,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Foydalanuvchining to‘liq ismi',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'Kirish uchun parol',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateAssistantDto extends CreateAdminDto {
  @ApiProperty({
    example: 1,
    description: 'Assistant bog‘lanadigan kurs ID',
  })
  @IsInt()
  @Min(1)
  courseId: number;
}

export class CreateMentorDto {
  @ApiProperty({ example: '+998902400025' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Adminov Adminjon' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  experience: number;

  @ApiProperty({ example: 'Full-stack software engineer' })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ example: 'https://t.me/raupov_manuchehr' })
  @IsUrl()
  @IsOptional()
  telegram?: string;

  @ApiProperty({ example: 'string' })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiProperty({ example: 'string' })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiProperty({ example: 'string' })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiProperty({ example: 'string' })
  @IsUrl()
  @IsOptional()
  github?: string;

  @ApiProperty({ example: 'string' })
  @IsUrl()
  @IsOptional()
  website?: string;
}
