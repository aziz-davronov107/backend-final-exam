import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseRatingDto } from './dto/create-ratin.dto';
import { PrismaService } from 'src/core/db/prisma.service';

@Injectable()
export class CourseRatingService {
  constructor(private prisma: PrismaService) {}

  async getLatest() {
    let ratings = await this.prisma.rating.findMany({
      include:{
        user:{
          select:{
            id:true,fullName:true,image:true
          }
        },
        course:{
          select:{
            id:true,name:true
          }
        }
      }
    }) 

    return{
      message:true,
      data:ratings
    }
  }

  async getList(courseId: string, offset = 0, limit = 8) {
    let course = await this.prisma.course.findUnique({where:{id:courseId},select:{id:true}});
    if(!course) throw new NotFoundException("Course not found");
    let ratings = await this.prisma.rating.findMany({
      skip:offset,
      take:limit,
      where:{
        course:{
          id:courseId
        }
      },
      include:{
        user:{
          select:{id:true,image:true,fullName:true}
        }
      }
    })

    return {
      message:true,
      data:ratings
    }
  }

  async getAnalytics(courseId: string) {
    let ratings = await this.prisma.rating.findMany({where:{courseId},select:{rate:true}})

    const counts = { one: 0, two: 0, three: 0, four: 0, five: 0 };
    if(ratings.length < 1){
      return {
        message:true,
        rate: 0,
        ...counts
      }
    }
    let sum = ratings.reduce((sum,r)=>  sum + r.rate,0)
    const rate = Number((sum / ratings.length).toFixed(1))

    for (const r of ratings) {
      switch (Math.round(r.rate)) {
        case 1:
          counts.one++;
          break;
        case 2:
          counts.two++;
          break;
        case 3:
          counts.three++;
          break;
        case 4:
          counts.four++;
          break;
        case 5:
          counts.five++;
          break;
      }
    }

    return {
      message:true,
      rate,
      ...counts
    }
  }

  async create(dto: CreateCourseRatingDto, userId: number) {
    let {courseId} = dto
    let rating = await this.prisma.rating.findFirst({
      where:{courseId,userId}
    })
    if (rating) throw new BadRequestException("You have already submitted a review for this course.");
    
    await this.prisma.rating.create({data:{...dto,userId}})
    return {
      message:true
    }
  }

  async remove(id: number) {
    let rating = await this.prisma.rating.findFirst({
      where:{id}
    })
    if (!rating) throw new BadRequestException("Rating not found.");
    await this.prisma.rating.delete({where:{id}})
    return{
      message:true
    }
  }
}
