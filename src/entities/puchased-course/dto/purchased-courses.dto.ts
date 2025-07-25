import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class GetPurchasedCoursesMineQueryDto {
  @ApiPropertyOptional({ example: 0 })
  @Type(() => Number)
  @IsOptional()
  offset?: number = 0;

  @ApiPropertyOptional({ example: 8 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 8;

  @ApiPropertyOptional({ example: 'search' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  category_id?: number;

  @ApiPropertyOptional({ enum: CourseLevel })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;
}

export class PurchaseCourseDto {
  @ApiProperty({ example: 'course-id' })
  @IsString()
  courseId: string;
}

export class CreatePurchasedCourseAdminDto {
  @ApiProperty({ example: 'course-id' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string;
}

export class GetCourseStudentsQueryDto {
  @ApiPropertyOptional({ example: 0 })
  @Type(() => Number)
  @IsOptional()
  offset?: number = 0;

  @ApiPropertyOptional({ example: 8 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 8;

  @ApiPropertyOptional({ example: 'search' })
  @IsOptional()
  @IsString()
  search?: string;
}
