  import { Module } from '@nestjs/common';
  import { LessonsController } from './lesson.controller';
  import { LessonsService } from './lesson.service';
  import { MulterModule } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import path, { extname } from 'path';
  import { v4 as uuidv4 } from 'uuid';
  import { BadRequestException } from '@nestjs/common';

  @Module({
    imports: [
      MulterModule.register({
        storage: diskStorage({
          destination: (req, file, cb) => {
            cb(null, path.join(process.cwd(), 'uploads/video'));
          },
          filename: (req, file, cb) => {
            const fileExt = extname(file.originalname);
            const uniqueName = `${uuidv4()}${fileExt}`;
            cb(null, uniqueName);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = [
            'video/mp4',
            'video/quicktime',
            'video/x-msvideo',
          ];
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new BadRequestException('Fayl formati ruxsat etilmagan'), false);
          }
        },
        limits: { fileSize: 100 * 1024 * 1024 },
      }),
    ],
    controllers: [LessonsController],
    providers: [LessonsService],
  })
  export class LessonModule {}
