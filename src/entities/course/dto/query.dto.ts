import {
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumberString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class GetCoursesQueryDto {
  @ApiPropertyOptional({
    description: 'Pagination offset',
    example: '0',
  })
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Pagination limit',
    example: '8',
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'nodejs',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Course level filter',
    enum: CourseLevel,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({
    description: 'Category ID filter',
    example: '1',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Mentor ID filter',
    example: '2',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  mentorId?: number;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: '0',
  })
  @IsOptional()
  @Type(() => Number)
  price_min?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: '1000',
  })
  @IsOptional()
  @Type(() => Number)
  price_max?: number;
}

export class GetCoursesQueryAdminDto extends PartialType(GetCoursesQueryDto) {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  published?: boolean;
}

export class GetCoursesQueryMyDto extends PartialType(
  OmitType(GetCoursesQueryAdminDto, ['mentorId'] as const),
) {}

export class GetAssistantsDto extends PickType(GetCoursesQueryDto, [
  'offset',
  'limit',
]) {}
