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

    const user = await this.prisma.user.findUnique({
      where: { phone },
    });
    let mentorId = 0

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await this.prisma.user.create({
        data: {
          phone,
          password: hashedPassword,
          fullName,
          role,
          image,
        },
      });
      let courseCategory = [
        { name: 'Frontend' },
        { name: 'Backend' },
        { name: 'DevOps' },
        { name: 'UI/UX Design' },
        { name: 'Data Science' },
        { name: 'Mobile Development' },
      ];

      await Promise.all(
        courseCategory.map((cat) =>
          this.prisma.courseCategory.create({
            data: { name: cat.name },
          }
        ),
      ),
      );

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
