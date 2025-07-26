import {
  Controller, Get, Post, Patch, Delete, Put,
  Param, Body, UploadedFile, UseInterceptors,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/core/decorators/role.decorator';

import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ViewLessonDto } from './dto/view-lesson.dto';
import { LessonsService } from './lesson.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}
  @Get('single/:lessonId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'STUDENT' })
  getSingleLesson(@Param('lessonId')  lessonId: string, @Req() req: any) {
    return this.lessonsService.getSingleLesson(req.user.id,lessonId);
  }

  @Put('view/:lessonId')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'STUDENT' })
  putLessonView(@Param('lessonId') lessonId: string, @Body() dto: ViewLessonDto,@Req() req: any) {
    return this.lessonsService.getSingleLesson(req.user.id,lessonId);
  }

  @Get('detail/:id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  getLessonDetail(@Param('id') id: string) {
    return this.lessonsService.getLessonDetail(id);
  }

  @Post('create')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  createLesson(@Body() dto: CreateLessonDto,@UploadedFile() file: {video: Express.Multer.File}){
    return this.lessonsService.createLesson(dto, file);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  updateLesson(@Param('id') id: string, @Body() dto: UpdateLessonDto, @UploadedFile() file: {video: Express.Multer.File}) {
    return this.lessonsService.updateLesson(id, dto, file);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  deleteLesson(@Param('id') id: string) {}
}