import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { EnrollmentGuard } from '../common/guards/enrollment.guard';

@Module({
  imports: [CacheModule.register()],
  controllers: [CoursesController],
  providers: [CoursesService, PrismaService, EnrollmentGuard],
})
export class CoursesModule {}
