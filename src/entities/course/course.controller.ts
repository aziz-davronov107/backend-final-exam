import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  CreateAssignedCourseDto,
  CreateCourseDto,
  DeleteAssignedCourseDto,
} from './dto/create-course.dto';
import { UpdateCourseDto, UpdateMentorDto } from './dto/update-course.dto';
import { Roles } from 'src/core/decorators/role.decorator';
import { CoursesService } from './course.service';
import {
  GetAssistantsDto,
  GetCoursesQueryAdminDto,
  GetCoursesQueryDto,
  GetCoursesQueryMyDto,
} from './dto/query.dto';
import { Public } from 'src/core/decorators/publick.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { IsUUID } from 'class-validator';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published courses' })
  getAll(@Query() query: GetCoursesQueryDto) {
    return this.coursesService.getAll(query);
  }

  @Public()
  @Get('single/:id')
  @ApiOperation({ summary: 'Get single course (public)' })
  @ApiParam({ name: 'id', type: String })
  getSingle(@Param('id') id: string) {
    return this.coursesService.getSingle(id);
  }

  @Get('single-full/:id')
  @Roles('ADMIN', 'MENTOR', 'ASSISTANT')
  @ApiOperation({ summary: 'ADMIN,MENTOR,ASSISTANT' })
  @ApiParam({ name: 'id', type: String })
  getSingleFull(@Param('id') id: string, @Req() req: Request) {
    return this.coursesService.getSingleFull(id, (req as any).user);
  }

  @Get('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  getAllAdmin(@Query() query: GetCoursesQueryAdminDto) {
    return this.coursesService.getAllAdmin(query);
  }

  @Get('my')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  getMyCourses(@Query() query: GetCoursesQueryMyDto, @Req() req: Request) {
    return this.coursesService.getMyCourses((req as any).user.id, query);
  }

  @Get('mentor/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  getCoursesByMentor(
    @Param('id') id: number,
    @Query() query: GetCoursesQueryMyDto,
  ) {
    return this.coursesService.getCoursesByMentor(id, query);
  }

  @Get('my/assigned')
  @Roles('ASSISTANT')
  @ApiOperation({ summary: 'ASSISTANT' })
  getAssignedCourses(
    @Req() req: Request,
    @Query() query: GetCoursesQueryMyDto,
  ) {
    return this.coursesService.getAssignedCourses((req as any).user.id, query);
  }

  @Get(':courseId/assistants')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  @ApiParam({ name: 'courseId', type: String })
  getAssistants(
    @Param('courseId') courseId: string,
    @Query() query: GetAssistantsDto,
  ) {
    return this.coursesService.getAssistants(courseId, query);
  }

  @Post('assign-assistant')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  assignAssistant(@Body() body: CreateAssignedCourseDto) {
    return this.coursesService.assignAssistant(body);
  }

  @Delete('unassign-assistant')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  unassignAssistant(@Body() body: DeleteAssignedCourseDto) {
    return this.coursesService.unassignAssistant(body);
  }

  @Post('create')
  @Roles('ADMIN', 'MENTOR')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCourseDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'introVideo', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  createCourse(
    @UploadedFiles()
    files: {
      banner: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
    @Body() body: CreateCourseDto,
    @Req() req: Request,
  ) {
    const bannerFile = files.banner?.[0];
    const introVidFile = files.introVideo?.[0];
    const bannerUrl = `${process.env.STATIC_URL}banner/${bannerFile.filename}`;
    const introUrl = introVidFile
      ? `${process.env.STATIC_URL}introvideo/${introVidFile.filename}`
      : null;
    const { banner, introVideo, ...courseData } = body;
    return this.coursesService.createCourse(
      { ...courseData, banner: bannerUrl, introVideo: introUrl },
      (req as any).user.id,
    );
  }

  @Patch('update/:id')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  @ApiParam({ name: 'id', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCourseDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'introVideo', maxCount: 1 },
    ]),
  )
  updateCourse(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      banner: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
    @Body() body: UpdateCourseDto,
  ) {
    const bannerFile = files.banner?.[0];
    const introVidFile = files.introVideo?.[0];
    const bannerUrl = bannerFile
      ? `${process.env.STATIC_URL}banner/${bannerFile.filename}`
      : null;
    const introUrl = introVidFile
      ? `${process.env.STATIC_URL}introvideo/${introVidFile.filename}`
      : null;
    const { banner, introVideo, ...courseData } = body;
    return this.coursesService.updateCourse(id, {
      banner: bannerUrl,
      introVideo: introUrl,
      ...courseData,
    });
  }

  @Post('publish/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  @ApiParam({ name: 'id', type: IsUUID })
  publishCourse(@Param('id') id: string) {
    return this.coursesService.publishCourse(id);
  }

  @Post('unpublish/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  @ApiParam({ name: 'id', type: IsUUID })
  unpublishCourse(@Param('id') id: string) {
    return this.coursesService.unpublishCourse(id);
  }

  @Patch('update-mentor')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'ADMIN' })
  updateMentor(@Body() body: UpdateMentorDto) {
    return this.coursesService.updateMentor(body);
  }

  @Delete('delete/:id')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'ADMIN,MENTOR' })
  @ApiParam({ name: 'id', type: IsUUID })
  deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
}
