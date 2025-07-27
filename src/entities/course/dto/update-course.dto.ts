import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { UUID } from 'crypto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

export class UpdateMentorDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;

  @IsUUID()
  @Type(() => IsUUID)
  @IsNotEmpty()
  courseDd: string;
}
