import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { IsUUID } from 'class-validator';
import { Public } from 'src/core/decorators/publick.decorator';
import { CreateCourseRatingDto } from './dto/create-ratin.dto';
import { CourseRatingService } from './ratin.service';

@ApiTags('Course Rating')
@Controller('course-rating')
export class CourseRatingController {
  constructor(private readonly courseRatingService: CourseRatingService) {}

  @Public()
  @Get('latest')
  async getLatest() {
    return this.courseRatingService.getLatest();
  }

  @Public()
  @ApiParam({name:"courseId",type:IsUUID,required:true})
  @ApiQuery({name:"offset",type:Number,example:0})
  @ApiQuery({name:"limit",type:Number,example:8})
  @Get('list/:courseId')
  async getList(
    @Param('courseId') courseId: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 8,
  ) {
    return this.courseRatingService.getList(courseId, offset, limit);
  }

  @Public()
  @ApiParam({name:"courseId",type:IsUUID,required:true})
  @Get('analytics/:courseId')
  async getAnalytics(@Param('courseId') courseId: string) {
    return this.courseRatingService.getAnalytics(courseId);
  }

  @ApiOperation({ summary: 'STUDENT' })
  @Roles(UserRole.STUDENT)
  @Post()
  async create(@Body() dto: CreateCourseRatingDto, @Req() req) {
    const userId = req.user.id;
    return this.courseRatingService.create(dto, userId);
  }

  @ApiOperation({ summary: 'ADMIN' })
  @Roles(UserRole.ADMIN)
  @ApiParam({name:"courseId",type:Number,required:true,example:1})
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.courseRatingService.remove(id);
  }
}
