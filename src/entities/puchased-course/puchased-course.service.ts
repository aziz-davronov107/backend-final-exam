import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/db/prisma.service';
import {
  GetPurchasedCoursesMineQueryDto,
  PurchaseCourseDto,
  CreatePurchasedCourseAdminDto,
  GetCourseStudentsQueryDto,
} from './dto/purchased-courses.dto'; 
import { PurchasedCourse } from '@prisma/client';

@Injectable()
export class PurchasedCoursesService {
  constructor(private prisma: PrismaService) {}

  async getMine(userId: number, query: GetPurchasedCoursesMineQueryDto){
    
  }

  async getMineById(userId: number, courseId: string){
    
  }

  async purchaseCourse(userId: number, data: PurchaseCourseDto) {
   
  }

  async getCourseStudents(courseId: string, query: GetCourseStudentsQueryDto) {
  
  }

  async createPurchasedByAdmin(data: CreatePurchasedCourseAdminDto) {
   
  }
}

