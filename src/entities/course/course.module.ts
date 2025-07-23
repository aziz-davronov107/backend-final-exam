import { BadRequestException, Module } from '@nestjs/common';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (file.fieldname === 'banner') {
            cb(null, './uploads/banner');
          } else if (file.fieldname === 'introVideo') {
            cb(null, './uploads/introvideo');
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
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CourseModule {}

