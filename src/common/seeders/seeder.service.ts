import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
    const role = 'ADMIN'; // UserRole enumdagi qiymat
    const image = null; // yoki biror URL string

    const existingUser = await this.prisma.user.findFirst({
      where: { phone },
    });

    if (!existingUser) {
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
