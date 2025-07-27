import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseCategoryDto} from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { PrismaService } from 'src/core/db/prisma.service';
import { deleteIfExists } from 'src/common/utils/delete.fs';
import path from 'path';

@Injectable()
export class CourseCategoryService {
  constructor (private prisma : PrismaService) { }
  async getAll(offset = 0, limit = 8) {
    const [total, data] = await this.prisma.$transaction([
      this.prisma.courseCategory.count(),
      this.prisma.courseCategory.findMany({
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return{
      message:true,
      total,
      data
    };
  }

  async getOne(id: number) {
    const category = await this.prisma.courseCategory.findUnique({where:{id}});
    if(!category){
      throw new NotFoundException("Category not found!")
    };
    return{
      message:true,
      data:category
    };
  }

  async create(dto: CreateCourseCategoryDto) {
    const exist_category = await this.prisma.courseCategory.findUnique({where:dto});
    if(exist_category){
      throw new NotFoundException("Category name already created!")
    };
    await this.prisma.courseCategory.create({data:dto});

    return{
      message:true,
    }
  }

  async update(id: number, dto: UpdateCourseCategoryDto) {
    const exist_category1 = await this.prisma.courseCategory.findUnique({where:{id}});
    const exist_category2 = await this.prisma.courseCategory.findUnique({where:dto});
    

    if(!exist_category1){
      throw new NotFoundException("Category not found!")
    };
    if(exist_category2){
      throw new NotFoundException("Category name already created!")
    };
    await this.prisma.courseCategory.create({data:dto});

    return{
      message:true,
    }
  }

  async remove(id: number) {
    const exist_category = await this.prisma.courseCategory.findUnique({where:{id}});

    if(!exist_category){
      throw new NotFoundException("Category not found!")
    };
    const courses = await this.prisma.course.findMany({
      where:{
        categoryId:id
      },
    })

    let course_id = courses.map((el)=> el.id);
    const Ispurchased = await this.prisma.purchasedCourse.findFirst({where:{courseId:{in: course_id}}})

    if (Ispurchased) {
      throw new BadRequestException(
        "This course has already been purchased by a user and cannot deleted!"
      );
    }

    courses.forEach((el)=>{
      let bannerpath = path.join(
        process.cwd(),
        el.banner.split('/api/')[1],
      );
      deleteIfExists(bannerpath);
      if (el.introVideo) {
        let introVideoPath = path.join(
          process.cwd(),
          el.introVideo.split('/api/')[1],
        );
        deleteIfExists(introVideoPath);
      }
    })
    await this.prisma.courseCategory.delete({where:{id}})

    return{ 
      message:true
    }
  }
}
