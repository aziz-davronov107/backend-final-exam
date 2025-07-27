import { IsInt, IsString, Min, Max, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCourseRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rate: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsUUID()
  courseId: string;
}