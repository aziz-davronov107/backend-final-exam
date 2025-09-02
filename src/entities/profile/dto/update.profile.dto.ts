import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProfileUpdateDto {
  @ApiPropertyOptional({ example: 'Bobur Ergashev' })
  @IsOptional()
  @IsString()
  fullName?: string;
}
