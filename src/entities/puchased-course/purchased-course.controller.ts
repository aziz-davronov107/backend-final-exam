import { Controller, Get, Post, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import {
  GetPurchasedCoursesMineQueryDto,
  PurchaseCourseDto,
  CreatePurchasedCourseAdminDto,
  GetCourseStudentsQueryDto,
} from './dto/purchased-courses.dto';
import { UserRole } from '@prisma/client';
import { PurchasedCoursesService } from './puchased-course.service';
import { Roles } from 'src/core/decorators/role.decorator';
import { IsUUID } from 'class-validator';

@ApiTags('purchased-courses')
@Controller('api/purchased-courses')
export class PurchasedCoursesController {
  constructor(private readonly service: PurchasedCoursesService) {}

  @Get('mine')
  @Roles(UserRole.STUDENT)
  getMine(@Req() req, @Query() query: GetPurchasedCoursesMineQueryDto) {
    return this.service.getMine(req.user.id, query);
  }

  @Get('mine/:course_id')
  @Roles(UserRole.STUDENT)
  @ApiParam({ name: 'course_id', type: IsUUID, description: 'Course ID'})
  getMineById(@Req() req, @Param('course_id') courseId: string) {
    return this.service.getMineById(req.user.id, courseId);
  }

  @Post('purchase')
  @Roles(UserRole.STUDENT)
  purchase(@Req() req, @Body() body: PurchaseCourseDto) {
    return this.service.purchaseCourse(req.user.id, body);
  }

  @Get('course/:id/students')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  getCourseStudents(@Param('id') courseId: string, @Query() query: GetCourseStudentsQueryDto) {
    return this.service.getCourseStudents(courseId, query);
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  createByAdmin(@Body() body: CreatePurchasedCourseAdminDto) {
    return this.service.createPurchasedByAdmin(body);
  }
}