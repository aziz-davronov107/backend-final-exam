import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateMentorDto,
  CreateAdminDto,
  CreateAssistantDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/publick.decorator';
import { UserRole } from '@prisma/client';
import { GetMentorsDto, GetUsersDto } from './dto/query.dto';
import { Roles } from 'src/core/decorators/role.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('mentors')
  get_mentors(@Query() query: GetMentorsDto) {
    let { search, limit, offset } = query;
    return this.userService.getMentors(search, limit ?? 10, offset ?? 0);
  }

  @Public()
  @ApiParam({
    name: 'id',
    required: false,
    type: Number,
    description: 'User ID',
  })
  @Get('mentor/:id')
  getMentorById(@Param('id') id: number) {
    return this.userService.getMentor(id);
  }

  @ApiOperation({ summary: 'ADMIN' })
  @Get()
  getAllUsers(@Query() query: GetUsersDto) {
    let { search, limit, offset, role } = query;
    return this.userService.getAllUsers(search, limit ?? 10, offset ?? 0, role);
  }

  @ApiOperation({
    summary: 'ADMIN',
  })
  @Roles(UserRole.ADMIN)
  @Get('single/:id')
  getSingleUser(@Param('id') id: number) {
    return this.userService.getSingleUser(id);
  }

  @ApiOperation({
    summary: 'ADMIN, MENTOR',
  })
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @Get('by-phone/:phone')
  getUserByPhone(@Param('phone') phone: string) {
    if (!phone.startsWith('+998') || phone.length !== 13) {
      throw new BadRequestException('Invalid phone number format');
    }
    return this.userService.getUserByPhone(phone);
  }

  @ApiOperation({
    summary: 'ADMIN',
  })
  @Roles(UserRole.ADMIN)
  @Post('create/admin')
  createAdmin(@Body() payload: CreateAdminDto) {
    let { phone } = payload;
    if (!phone.startsWith('+998') || phone.length !== 13) {
      throw new BadRequestException('Invalid phone number format');
    }
    return this.userService.createAdmin(payload);
  }

  @ApiOperation({
    summary: 'ADMIN',
  })
  @Roles(UserRole.ADMIN)
  @Post('create/mentor')
  createMentor(@Body() payload: CreateMentorDto) {
    let { phone } = payload;
    if (!phone.startsWith('+998') || phone.length !== 13) {
      throw new BadRequestException('Invalid phone number format');
    }
    return this.userService.createMentor(payload);
  }

  @ApiOperation({
    summary: 'ADMIN, MENTOR',
  })
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @Post('create/assistant')
  createAssistant(@Body() payload: CreateAssistantDto) {
    let { phone } = payload;
    if (!phone.startsWith('+998') || phone.length !== 13) {
      throw new BadRequestException('Invalid phone number format');
    }
    return this.userService.createAssistant(payload);
  }

  @ApiOperation({
    summary: 'ADMIN',
  })
  @Roles(UserRole.ADMIN)
  @Patch('update/mentor/:id')
  updateMentor(@Param('id') id: number, @Body() payload: UpdateUserDto) {
    let { phone } = payload;
    if ((phone && !phone?.startsWith('+998')) || phone?.length !== 13) {
      throw new BadRequestException('Invalid phone number format');
    }
    return this.userService.updateMentor(id, payload);
  }

  @ApiOperation({
    summary: 'ADMIN',
  })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
