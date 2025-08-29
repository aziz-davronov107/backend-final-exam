import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ViewLessonDto } from './dto/view-lesson.dto';
import { PrismaService } from 'src/core/db/prisma.service';


@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {} 
  async getSingleLesson(userId:number,lessonId: string) {
    let puchasedCourse = await this.prisma.purchasedCourse.findFirst({
      where: { userId, course: { lessons: { some: { id: lessonId } } } },
    })
    if (!puchasedCourse) {
      throw new NotFoundException('Purchased course not found for this lesson');
    }
    let lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { Course: true, lessonFiles: true ,homework: true,lessonViews: true},
    })
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return {
      message: true,
      data: lesson,
    };
  }

  async putLessonView(userId:number,lessonId: string, dto: ViewLessonDto) {
    const {view=true} = dto;  
    let lessonView = await this.prisma.lessonView.create({
      data: {
        lessonId,
        userId,
        view,
      },
    })
    return {
      menuber: true,
      data: lessonView,
    }
  }

  async getLessonDetail(id: string) {
    let lesson = await this.prisma.lesson.findFirst({
      where: { id },
      include: { Course: true, lessonFiles: true, homework: true, lessonViews: true },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }   

    return {
      message: true,
      data: lesson,
    };
  }

  async createLesson(dto: CreateLessonDto, file: {video:Express.Multer.File}) {
    let { name,about,groupId,videoUrl} = dto;
    if (!file && !videoUrl) {
      throw new NotFoundException('Video file or URL is required');
    }
    let  videoPath = '';
    if (file) {
      const video = file.video[0];
      videoPath = `${process.env.STATIC_URL}video/${video.filename}`;
    }
    let lesson = await this.prisma.lesson.create({
      data: {
        name,
        about,
        groupId,
        video: videoUrl || videoPath,
      }
    })

    return {
      message: true,
      data: lesson,      
    };
  }

  async updateLesson(id: string, dto: UpdateLessonDto, file:{video:Express.Multer.File}) {
    let { name, about, groupId, videoUrl } = dto;
    let  videoPath = '';
    if (file) {
      const video = file.video[0];
      videoPath = `${process.env.STATIC_URL}video/${video.filename}`;
    }
    let data:any = {}
    if (name){
      data.name = name;
    }
    if (about) {
      data.about = about;
    }
    if (groupId) {
      data.groupId = groupId;
    }
    if (videoUrl || videoPath) {
      data.video = videoUrl || videoPath;
    }


    let lesson = await this.prisma.lesson.update({
      where: { id },
      data,     
    });
    return {
      message: true,
      data: lesson,
    }
  }

  async deleteLesson(id: string) {
    let lesson = await this.prisma.lesson.findFirst({
      where: { id },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    await this.prisma.lesson.delete({
      where: { id },
    });
    return {
      message: true,
    }

  }
}