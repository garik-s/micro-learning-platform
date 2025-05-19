import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache,) { }

    createCourse(dto: CreateCourseDto, instructorId: number) {
        return this.prisma.course.create({
            data: {
                ...dto,
                instructorId,
            },
        });
    }

    async addLesson(courseId: number, dto: CreateLessonDto) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) throw new NotFoundException('Course not found');

        return this.prisma.lesson.create({
            data: {
                ...dto,
                courseId,
            },
        });
    }

    async enroll(courseId: number, studentId: number) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        return this.prisma.enrollment.create({
            data: {
                courseId,
                userId: studentId,
            },
        });
    }


    async listLessons(courseId: number, userId: number) {
        const cacheKey = `lessons:${courseId}:${userId}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return cached;

        const enrolled = await this.prisma.enrollment.findFirst({
            where: { courseId, userId },
        });

        if (!enrolled) throw new ForbiddenException('Not enrolled in course');

        const lessons = await this.prisma.lesson.findMany({ where: { courseId } });

        await this.cacheManager.set(cacheKey, lessons);
        return lessons;
    }

}
