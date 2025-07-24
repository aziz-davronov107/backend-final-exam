import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/publick.decorator';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';

@ApiTags('Course Category')
@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Public()
  @Get('all')
  @ApiQuery({name:"offset",type:Number, example: 0})
  @ApiQuery({name:"limit",type:Number, example: 8})
  getAll(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return this.courseCategoryService.getAll(offset, limit);
  }

  @Public()
  @ApiParam({name:"id",type:Number,example:2})
  @Get('single/:id')
  getOne(@Param('id') id: number) {
    return this.courseCategoryService.getOne(id);
  }

  @ApiOperation({ summary: 'ADMIN' })
  @Post()
  create(@Body() dto: CreateCourseCategoryDto) {
    return this.courseCategoryService.create(dto);
  }

  @ApiOperation({ summary: 'ADMIN' })
  @ApiParam({name:"id",type:Number,example:2})
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCourseCategoryDto,
  ) {
    return this.courseCategoryService.update(id, dto);
  }

  @ApiOperation({ summary: 'ADMIN' })
  @Delete(':id')
  @ApiParam({name:"id",type:Number,example:2})
  remove(@Param('id') id: number) {
    return this.courseCategoryService.remove(+id);
  }
}
