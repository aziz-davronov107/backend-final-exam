import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/db/prisma.service';
import {
  GetAssistantsDto,
  GetCoursesQueryAdminDto,
  GetCoursesQueryDto,
  GetCoursesQueryMyDto,
} from './dto/query.dto';
import { Prisma, UserRole } from '@prisma/client';
import {
  CreateAssignedCourseDto,
  CreateCourseDto,
  DeleteAssignedCourseDto,
} from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { deleteIfExists } from 'src/common/utils/delete.fs';
import path from 'path';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}
  async getAll(query: GetCoursesQueryDto) {
    let { offset = 0, limit = 10, ...rest } = query;
    let where: Record<string, any> = {};
    where.published = true;
    Object.entries(rest).forEach(([key, value]) => {
      if (value != null && value != undefined) {
        if (key === 'search') {
          where['name'] = { contains: value, mode: 'insensitive' };
        } else if (key === 'price_min' || key === 'price_max') {
          where['price'] = where['price'] || {};
          if (key === 'price_min') where['price'].gte = value;
          if (key === 'price_max') where['price'].lte = value;
        } else {
          where[key] = value;
        }
      }
    });
    let courses = await this.prisma.course.findMany({
      where,
      skip: offset,
      take: limit,
      include: { category: true, mentor: true },
    });
    if (courses.length == 0) throw new NotFoundException('Course topilmadi');
    return {
      message: true,
      data: courses,
    };
  }
  async getSingle(id: string) {
    let courses = await this.prisma.course.findMany({
      where: { id, published: true },
      include: { category: true, mentor: true },
    });
    if (courses.length == 0) throw new NotFoundException('Course topilmadi');
    return {
      message: true,
      data: courses,
    };
  }
  async getSingleFull(id: string, user: any) {
    let { role } = user;
    let where: Prisma.CourseWhereUniqueInput =
      role === UserRole.ADMIN ? { id } : { id, published: true };

    const course = await this.prisma.course.findUnique({
      where,
      include: {
        category: true,
        mentor: {
          include: {
            mentorProfile: true,
          },
        },
        assigned: {
          include: {
            user: true,
          },
        },
        purchased: {
          include: {
            user: true,
          },
        },
        ratings: {
          include: {
            user: true,
          },
        },
        questions: {
          include: {
            user: true,
            answer: {
              include: {
                user: true,
              },
            },
          },
        },
        lessons: {
          include: {
            lessonFiles: true,
            lessonViews: true,
            homework: {
              include: {
                submissions: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            LastActivity: true,
          },
        },
        lessonGroups: {
          include: {
            exams: true,
            examResults: {
              include: {
                user: true,
              },
            },
            lessons: true,
            LastActivity: true,
          },
        },
        LastActivity: true,
      },
    });

    if (!course) throw new NotFoundException('Course topilmadi');
    return {
      meassage: true,
      data: course,
    };
  }
  async getAllAdmin(query: GetCoursesQueryAdminDto) {
    let { limit = 10, offset = 0, ...rest } = query;
    let where: Record<string, any> = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (value != null && value != undefined) {
        if (key === 'search') {
          where['name'] = { contains: value, mode: 'insensitive' };
        } else if (key === 'price_min' || key === 'price_max') {
          where['price'] = where['price'] || {};
          if (key === 'price_min') where['price'].gte = value;
          if (key === 'price_max') where['price'].lte = value;
        } else {
          where[key] = value;
        }
      }
    });
    let courses = await this.prisma.course.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        category: true,
        mentor: true,
      },
    });
    return {
      message: true,
      data: courses,
    };
  }
  async getMyCourses(mentorId: number, query: GetCoursesQueryMyDto) {
    let { limit = 10, offset = 0, ...rest } = query;
    let where: Record<string, any> = {};
    where.mentorId = mentorId;
    Object.entries(rest).forEach(([key, value]) => {
      if (value != null && value != undefined) {
        if (key === 'search') {
          where['name'] = { contains: value, mode: 'insensitive' };
        } else if (key === 'price_min' || key === 'price_max') {
          where['price'] = where['price'] || {};
          if (key === 'price_min') where['price'].gte = value;
          if (key === 'price_max') where['price'].lte = value;
        } else {
          where[key] = value;
        }
      }
    });
    let courses = await this.prisma.course.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        category: true,
        mentor: true,
      },
    });
    return {
      message: true,
      data: courses,
    };
  }
  async getCoursesByMentor(mentorId: number, query: GetCoursesQueryMyDto) {
    let { limit = 10, offset = 0, ...rest } = query;
    let where: Record<string, any> = {};
    where.mentorId = mentorId;
    Object.entries(rest).forEach(([key, value]) => {
      if (value != null && value != undefined) {
        if (key === 'search') {
          where['name'] = { contains: value, mode: 'insensitive' };
        } else if (key === 'price_min' || key === 'price_max') {
          where['price'] = where['price'] || {};
          if (key === 'price_min') where['price'].gte = value;
          if (key === 'price_max') where['price'].lte = value;
        } else {
          where[key] = value;
        }
      }
    });
    let courses = await this.prisma.course.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        category: true,
        mentor: true,
      },
    });
    return {
      message: true,
      data: courses,
    };
  }
  async getAssignedCourses(assistantId: number, query: GetCoursesQueryMyDto) {
    let { limit = 10, offset = 0, ...rest } = query;
    let where: Record<string, any> = {
      assignedCourse: {
        some: { assistantId },
      },
    };
    Object.entries(rest).forEach(([key, value]) => {
      if (value != null && value != undefined) {
        if (key === 'search') {
          where['name'] = { contains: value, mode: 'insensitive' };
        } else if (key === 'price_min' || key === 'price_max') {
          where['price'] = where['price'] || {};
          if (key === 'price_min') where['price'].gte = value;
          if (key === 'price_max') where['price'].lte = value;
        } else {
          where[key] = value;
        }
      }
    });
    let courses = await this.prisma.course.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        category: true,
        mentor: true,
      },
    });
    return {
      message: true,
      data: courses,
    };
  }
  async getAssistants(courseId: string, query: GetAssistantsDto) {
    let { offset = 0, limit = 10 } = query;
    let assistant = await this.prisma.user.findMany({
      where: {
        role: UserRole.ASSISTANT,
        assignedCourses: { some: { courseId } },
      },
      take: limit,
      skip: offset,
    });
    return {
      message: true,
      data: assistant,
    };
  }
  async assignAssistant(body: CreateAssignedCourseDto) {
    let exist_assistant = await this.prisma.assignedCourse.findUnique({
      where: {
        userId_courseId: { userId: body.userId, courseId: body.courseId },
      },
    });
    if (exist_assistant)
      throw new ConflictException(
        'This assistant already assigned to course',
    );

    let assistant = await this.prisma.assignedCourse.create({
      data: body,
    });
    return {
      message: true,
      data: assistant,
    };
  }
  async unassignAssistant(body: DeleteAssignedCourseDto) {
    let exist_assistant = await this.prisma.assignedCourse.findUnique({
      where: {
        userId_courseId: { userId: body.userId, courseId: body.courseId },
      },
    });
    if (!exist_assistant)
      throw new NotFoundException(
        'This assistant Not found assigned to course',
      );
    let assistant = await this.prisma.assignedCourse.delete({
      where: {
        userId_courseId: { userId: body.userId, courseId: body.courseId },
      },
    });
    return {
      message: true,
      data: assistant,
    };
  }
  async createCourse(dto: CreateCourseDto, mentorId: number) {
    let  mentor = await this.prisma.user.findUnique({where:{id:mentorId}})

    const course = await this.prisma.course.create({
      data: {
        ...dto,
        mentorId,
        published: mentor?.role === UserRole.ADMIN,
      },
    });

    return { message: true, data: course };
  }
  async updateCourse(id: string, dto: UpdateCourseDto) {
    let update: Record<string, any> = {};
    Object.entries(dto).forEach(([key, value]) => {
      if (value != null && value != undefined) {
        update[key] = value;
      }
    });
    if (update.introVideo || update.banner) {
      let old = await this.prisma.course.findUnique({ where: { id } });
      if (old && update.introVideo && old.introVideo) {
        let introUrlpath = path.join(
          process.cwd(),
          old.introVideo.split('/api/')[1],
        );
        deleteIfExists(introUrlpath);
      }
      if (old && update.banner && old.banner) {
        let bannerpath = path.join(process.cwd(), old.banner.split('/api/')[1]);
        deleteIfExists(bannerpath);
      }
    }
    let updated = await this.prisma.course.update({
      where: { id },
      data: update,
    });
    return 'updated';
  }
  async publishCourse(id: string) {
    let exist_course = await this.prisma.course.findUnique({ where: { id } });
    if (!exist_course || exist_course.published) {
      throw new BadRequestException(
        'This course has already been purchased by a user and cannot be modified.',
      );
    }
    await this.prisma.course.update({
      where: { id },
      data: { published: true },
    });
    return { message: true };
  }
  async unpublishCourse(id: string) {
    let exist_course = await this.prisma.course.findUnique({ where: { id } });
    if (!exist_course || !exist_course.published) {
      throw new BadRequestException(
        'this course already unpublished or not found',
      );
    }
    const isPurchased = await this.prisma.purchasedCourse.findFirst({
      where: { courseId: id },
    });

    if (isPurchased) {
      throw new BadRequestException(
        'This course has already been purchased by a user and cannot be modified.',
      );
    }

    await this.prisma.course.update({
      where: { id },
      data: { published: false },
    });
    return { message: true };
  }
  async updateMentor(body: any) {
    let exist_course = await this.prisma.course.findUnique({
      where: { id: body.courseId },
    });
    if (!exist_course || exist_course.published) {
      throw new BadRequestException(
        'this course already published or not found',
      );
    }
    const isPurchased = await this.prisma.purchasedCourse.findFirst({
      where: { courseId: body.courseId },
    });

    if (isPurchased) {
      throw new BadRequestException(
        'This course has already been purchased by a user and cannot be modified.',
      );
    }

    await this.prisma.course.update({
      where: { id: body.courseId },
      data: { mentorId: body.userId },
    });
    return { message: true };
  }
  async deleteCourse(id: string) {
    let exist_course = await this.prisma.course.findUnique({ where: { id } });
    if (!exist_course || exist_course.published) {
      throw new BadRequestException(
        'this course already published or not found',
      );
    }
    const isPurchased = await this.prisma.purchasedCourse.findFirst({
      where: { courseId: id },
    });

    if (isPurchased) {
      throw new BadRequestException(
        'This course has already been purchased by a user and cannot be deleted.',
      );
    }
    let bannerpath = path.join(
      process.cwd(),
      exist_course.banner.split('/api/')[1],
    );
    await deleteIfExists(bannerpath);
    if (exist_course.introVideo) {
      let introVideoPath = path.join(
        process.cwd(),
        exist_course.introVideo.split('/api/')[1],
      );
      await deleteIfExists(introVideoPath);
    }
    await this.prisma.course.delete({ where: { id } });
    return { message: true };
  }
}
  