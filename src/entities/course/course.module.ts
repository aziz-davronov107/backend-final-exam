import { BadRequestException, Module } from '@nestjs/common';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CourseRatingService } from './ratin/ratin.service';
import { CourseRatingController } from './ratin/ratin.controller';
import { CourseCategoryController } from './course-category/course-category.controller';
import { CourseCategoryService } from './course-category/course-category.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (file.fieldname === 'banner') {
            cb(null, '../uploads/banner');
          } else if (file.fieldname === 'introVideo') {
            cb(null, '../uploads/introvideo');
          }
        },
        filename: (req, file, cb) => {
          const fileExt = extname(file.originalname);
          const uniqueName = `${uuidv4()}${fileExt}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'video/mp4'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Fayl formati ruxsat etilmagan'), false);
        }
      },
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  ],
  controllers: [CoursesController,CourseRatingController,CourseCategoryController],
  providers: [CoursesService,CourseCategoryService,CourseRatingService],
})
export class CourseModule {}

