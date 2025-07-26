import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/db/prisma.service';
import {
  GetPurchasedCoursesMineQueryDto,
  PurchaseCourseDto,
  CreatePurchasedCourseAdminDto,
  GetCourseStudentsQueryDto,
} from './dto/purchased-courses.dto'; 
import { PaidVia, PurchasedCourse } from '@prisma/client';

@Injectable()
export class PurchasedCoursesService {
  constructor(private prisma: PrismaService) {}

  async getMine(userId: number, query: GetPurchasedCoursesMineQueryDto){
    const { offset=0, limit=10, search, category_id, level } = query;
    const where: any = {
      userId,
    };
    if (search) {
      where.course = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }
    if (category_id) {
      where.course = {
        ...where.course,
        categoryId: category_id,
      };
    }
    if (level) {
      where.course = {
        ...where.course,
        level,
      };
    }
    const purchasedCourses = await this.prisma.purchasedCourse.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        course: true,
      },
    });

    return{
      message:true,
      data:purchasedCourses,
      total: await this.prisma.purchasedCourse.count({ where }),
    }
  }

  async getMineById(userId: number, courseId: string){
    const purchasedCourse = await this.prisma.purchasedCourse.findFirst({
      where:{
        userId,
        courseId,
      },
      include: {
        course: true
      }
    });
    if (!purchasedCourse) {
      throw new NotFoundException('Purchased course not found!');
    }
    return {
      message: true,
      data: purchasedCourse,
    }
  }

  async purchaseCourse(userId: number, data: PurchaseCourseDto) {
    const { courseId } = data;
    const payment = await this.prisma.transaction.findFirst({
      where:{
        userId,
        courseId,
      }
    })

    if (!payment) {
      throw new NotFoundException('Payment not found for this course!');
    }

    const purchasedCourse = await this.prisma.purchasedCourse.create({
      data: {
        userId,
        courseId,
        amount: payment.amount,
        paidVia: PaidVia.PAYME,
      },
      include: {
        course: true,
      },
    });

    return {
      message: true,
      data: purchasedCourse,
    };
  }

  async getCourseStudents(courseId: string, query: GetCourseStudentsQueryDto) {
    const { offset = 0,limit = 10, search } = query;
    const where: any = {
      courseId,
    };
    if (search) {
      where.user = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }
    const students = await this.prisma.purchasedCourse.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        user: true,
      },
    });
  }

  async createPurchasedByAdmin(data: CreatePurchasedCourseAdminDto) {
    const { courseId, phone } = data;
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found!');
    }
    const user = await this.prisma.user.findFirst({
      where: { phone },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const purchasedCourse = await this.prisma.purchasedCourse.create({
      data: {
        userId: user.id,
        courseId,
        amount: course.price,
        paidVia: PaidVia.CLICK,
      },
      include: {
        course: true,
      },
    });
    return {
      message: true,
      data:purchasedCourse,
    }
  }
}

