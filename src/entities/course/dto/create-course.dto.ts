import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ description: 'Kurs nomi', example: 'JavaScript Boshlang‘ich' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Kurs haqida batafsil', example: 'Ushbu kurs…' })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({ description: 'Kurs narxi', example: 120000, type: Number })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Kurs darajasi', enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ description: 'Category ID (int)', example: 3, type: Number })
  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @ApiProperty({
    description: 'Banner rasmi',
    type: 'string',
    format: 'binary',
    required: true,
  })
  banner: any;

  @ApiPropertyOptional({
    description: 'Intro video (ixtiyoriy)',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  introVideo?: any;
}

export class CreateAssignedCourseDto {
  @ApiProperty({
    description: 'Assistant (user) ning ID si',
    example: 42,
  })
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Biriktirilayotgan kursning ID si (UUID yoki String)',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsString()
  courseId: string;
}
export class DeleteAssignedCourseDto extends CreateAssignedCourseDto {}
