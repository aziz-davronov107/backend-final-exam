import { Module } from '@nestjs/common';
import { PurchasedCoursesService } from './puchased-course.service';
import { PurchasedCoursesController } from './purchased-course.controller';

@Module({
  providers: [PurchasedCoursesService],
  controllers: [PurchasedCoursesController]
})
export class PuchasedCourseModule {}
