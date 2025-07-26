import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  about: string;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  videoUrl?: string;
}