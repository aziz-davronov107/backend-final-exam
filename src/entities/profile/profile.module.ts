import { BadRequestException, Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
    imports: [
        MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(process.cwd(), 'uploads/avatar'));
        },
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
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
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
