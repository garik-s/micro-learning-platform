import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { EnrollmentGuard } from '../common/guards/enrollment.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RequestWithUser } from '../common/interfaces/request.interface';


@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  createCourse(@Body() dto: CreateCourseDto, @Req() req: RequestWithUser) {
    return this.coursesService.createCourse(dto, req.user.sub);
  }

  @Post(':id/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  addLesson(
    @Param('id') courseId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.coursesService.addLesson(+courseId, dto);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  enroll(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.enroll(+id, req.user.sub);
  }

  @Get(':id/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard, EnrollmentGuard)
  async listLessons(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.listLessons(+id, req.user.sub);
  }
}
