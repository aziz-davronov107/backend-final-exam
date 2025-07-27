import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/db/prisma.service';
import {
  CreateAdminDto,
  CreateAssistantDto,
  CreateMentorDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMentors(search?: string, limit?: number, offset?: number) {
    let users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      where: {
        role: 'MENTOR',
        OR: search
          ? [
              {
                fullName: { contains: search, mode: 'insensitive' },
              },
              {
                phone: { contains: search, mode: 'insensitive' },
              },
              {
                mentorProfile: {
                  job: { contains: search, mode: 'insensitive' },
                },
              },
            ]
          : undefined,
      },
      include: {
        mentorProfile: true,
      },
    });
    return {
      status: true,
      data: users.map(({ password, ...rest }) => rest),
    };
  }
  async getMentor(id: number) {
    let user = await this.prisma.user.findUnique({
      where: { id, role: 'MENTOR' },

      include: {
        mentorProfile: true,
        _count: {
          select: { coursesMentored: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    let { password, ...data } = user;

    return {
      status: true,
      data,
    };
  }
  async getAllUsers(
    search?: string,
    limit?: number,
    offset?: number,
    role?: string,
  ) {
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        {
          fullName: { contains: search, mode: 'insensitive' },
        },
        {
          phone: { contains: search, mode: 'insensitive' },
        },
        {
          mentorProfile: {
            job: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }
    let users = await this.prisma.user.findMany({
      skip: offset,
      take: limit,
      where,
      include: {
        mentorProfile: true,
      },
    });
    return {
      status: true,
      data: users.map(({ password, ...rest }) => rest),
    };
  }
  async getSingleUser(id: number) {
    let user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        mentorProfile: true,
        _count: {
          select: { coursesMentored: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    let { password, ...data } = user;

    return {
      status: true,
      data,
    };
  }
  async getUserByPhone(phone: string) {
    let user = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        mentorProfile: true,
        _count: {
          select: { coursesMentored: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    let { password, ...data } = user;

    return {
      status: true,
      data,
    };
  }
  async createAdmin(payload: CreateAdminDto) {
    let admin = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (admin) {
      throw new ConflictException('Admin already exists!');
    }
    await this.prisma.user.create({ data: payload });
    return {
      message: true,
    };
  }
  async createMentor(payload: CreateMentorDto) {
    let user = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (user) {
      throw new ConflictException('User already exists!');
    }
    let { phone, fullName, password, ...profile } = payload;
    let new_user = await this.prisma.user.create({ data: payload });
    await this.prisma.mentorProfile.create({
      data: { ...profile, userId: new_user.id },
    });
    return {
      message: true,
    };
  }
  async createAssistant(payload: CreateAssistantDto) {
    let assistant = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (assistant) {
      throw new ConflictException('assistant already exists!');
    }
    await this.prisma.user.create({ data: payload });
    return {
      message: true,
    };
  }
  async updateMentor(id: number, payload: UpdateUserDto) {
    let user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    let update: Record<string, any> = {};

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        update[key] = value;
      }
    });

    await this.prisma.user.update({
      where: { id },
      data: {
        mentorProfile: {
          update,
        },
      },
    });
    return {
      message: true,
    };
  }
  async deleteUser(id: number) {
    let user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    if (user.phone == '+998905631170')
      throw new ForbiddenException(
        'Siz Eng katta ADMINNI Ochirmoqchi bolyapsiz!',
      );
    await this.prisma.user.delete({ where: { id } });
  }
}
