import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCourseCategoryDto {
    @ApiProperty({ example: 'Frontend', description: 'Category nomi' })
    @IsString()
    name: string;
}
