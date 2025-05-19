import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;
  let cacheManager: Cache;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockPrisma = {
    course: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    lesson: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    enrollment: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a course', async () => {
    const dto = { title: 'NestJS 101', description: 'Intro course' };
    mockPrisma.course.create.mockResolvedValue({ id: 1, ...dto });

    const result = await service.createCourse(dto, 1);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mockPrisma.course.create).toHaveBeenCalledWith({
      data: { ...dto, instructorId: 1 },
    });
  });

  it('should return cached lessons if available', async () => {
    const mockLessons = [{ id: 1, title: 'Lesson 1' }];
    mockCacheManager.get.mockResolvedValue(mockLessons);

    const result = await service.listLessons(1, 1);
    expect(result).toEqual(mockLessons);
    expect(mockCacheManager.get).toHaveBeenCalledWith('lessons:1:1');
  });

  it('should fetch lessons and cache them if not cached', async () => {
    mockCacheManager.get.mockResolvedValue(null);
    mockPrisma.enrollment.findFirst.mockResolvedValue({ id: 1 });
    const mockLessons = [{ id: 1, title: 'Lesson 1' }];
    mockPrisma.lesson.findMany.mockResolvedValue(mockLessons);

    const result = await service.listLessons(1, 1);

    expect(result).toEqual(mockLessons);
    expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({ where: { courseId: 1 } });
    expect(mockCacheManager.set).toHaveBeenCalledWith('lessons:1:1', mockLessons);
  });
});
