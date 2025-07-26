import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ViewLessonDto {
  @ApiProperty()
  @IsBoolean()
  view: boolean;
}