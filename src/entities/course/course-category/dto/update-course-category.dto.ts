import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateCourseCategoryDto {
  @ApiProperty({ example: 'Mobil Dasturlash', description: 'Yangi category nomi' })
  @IsString()
  name: string;
}