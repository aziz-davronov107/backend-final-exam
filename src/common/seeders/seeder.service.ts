import { Injectable, OnModuleInit } from '@nestjs/common';
import { CourseLevel, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';
import { PrismaService } from 'src/core/db/prisma.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async seedAll() {
    await this.seedUsers();
  }

  async seedUsers() {
    const phone = '+998905341009';
    const fullName = 'Azizbek Yandiev';
    const password = 'yandiev';
    const role = UserRole.ADMIN; // UserRole enumdagi qiymat
    const image = null; // yoki biror URL string

    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      let {id:mentorId} = await this.prisma.user.create({
        data: {
          phone,
          password: hashedPassword,
          fullName,
          role,
          image,
        },
      });
      let courseCategory = [
        { "name": "Frontend" },
        { "name": "Backend" },
        { "name": "DevOps" },
        { "name": "UI/UX Design" },
        { "name": "Data Science" },
        { "name": "Mobile Development" }
      ]
      


      const categories = await Promise.all([
        this.prisma.courseCategory.create({ data: { name: 'Frontend' } }),
        this.prisma.courseCategory.create({ data: { name: 'Backend' } }),
        this.prisma.courseCategory.create({ data: { name: 'DevOps' } }),
        this.prisma.courseCategory.create({ data: { name: 'UI/UX Design' } }),
        this.prisma.courseCategory.create({ data: { name: 'Data Science' } }),
        this.prisma.courseCategory.create({ data: { name: 'Mobile Development' } }),
      ]);

      const courses = [
  {
    name: "Frontend Dasturlash",
    about: "HTML, CSS, JavaScript va React bo'yicha to'liq kurs.",
    price: 1500000,
    level: CourseLevel.BEGINNER,
    categoryId: categories[0].id,
    mentorId: mentorId,
    banner: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // rasm URL
    introVideo: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" // video URL
  },
  {
    name: "Backend Dasturlash",
    about: "Node.js, NestJS va PostgreSQL orqali backend ishlab chiqish.",
    price: 1800000,
    level: CourseLevel.INTERMEDIATE,
    categoryId: categories[1].id,
    mentorId: mentorId,
    banner: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    introVideo: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    name: "Mobil Ilovalar",
    about: "Flutter yordamida Android va iOS ilovalar yaratish.",
    price: 2000000,
    level: CourseLevel.BEGINNER,
    categoryId: categories[2].id,
    mentorId: mentorId,
    banner: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
    introVideo: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  },
  {
    name: "Data Science",
    about: "Python, Pandas, NumPy, Machine Learning va Data Visualization.",
    price: 2500000,
    level: CourseLevel.ADVANCED,
    categoryId: categories[3].id,
    mentorId: mentorId,
    banner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    introVideo: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
  }
];

      await this.prisma.course.createMany({
        data:courses
      })

      console.log('✅ Superadmin user created!');
    } else {
      console.log('ℹ️ Superadmin user already exists.');
    }
  }

  async onModuleInit() {
    try {
      await this.seedAll();
    } catch (error) {
      console.error('❌ Seeder error:', error.message);
      process.exit(1);
    }
  }
}
