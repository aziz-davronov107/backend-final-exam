import { Module } from '@nestjs/common';
import { UserModule } from './entities/user/user.module';
import { CourseModule } from './entities/course/course.module';
import { LessonModule } from './entities/lesson/lesson.module';
import { HomeworkModule } from './entities/homework/homework.module';
import { ExamModule } from './entities/exam/exam.module';
import { CoreModule } from './core/core.module/core.module';
import { VerificationModule } from './entities/verification/verification.module';
import { AuthModule } from './entities/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './core/guards/auth-guards';
import { PuchasedCourseModule } from './entities/puchased-course/purchased-course.module';
import { RolesGuard } from './core/guards/role-guards';
import { SeederModule } from './common/seeders/seeder.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    CourseModule,
    LessonModule,
    HomeworkModule,
    ExamModule,
    VerificationModule,
    AuthModule,
    PuchasedCourseModule,
    SeederModule,
    
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
