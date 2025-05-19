import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Courses E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentToken: string;
  let courseId: number;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    await app.listen(0);

    prisma = app.get(PrismaService);

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'student@test.com', password: '12345678', role: 'student' });

    const studentRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'student@test.com', password: '12345678' });
    studentToken = studentRes.body.access_token;

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'inst@test.com', password: '12345678', role: 'instructor' });

    const instructor = await prisma.user.findUnique({
      where: { email: 'inst@test.com' },
    });
    if (!instructor) throw new Error('Instructor not found');

    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        description: 'Description',
        instructorId: instructor.id,
      },
    });
    courseId = course.id;

    await prisma.lesson.createMany({
      data: [
        { title: 'L1', content: 'C1', courseId },
        { title: 'L2', content: 'C2', courseId },
      ],
    });
  });

  afterAll(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.answer?.deleteMany();
    await prisma.question?.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should enroll student and return 201', async () => {
    const res = await request(app.getHttpServer())
      .post(`/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.courseId).toBe(courseId);
  });

  it('should return lessons after enrollment', async () => {
    const res = await request(app.getHttpServer())
      .get(`/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('title');
  });

  it('should return 401 when enrolling without auth token', async () => {
    await request(app.getHttpServer())
      .post(`/courses/${courseId}/enroll`)
      .expect(401);
  });

  it('should return 404 when enrolling in a non-existent course', async () => {
    await request(app.getHttpServer())
      .post(`/courses/999999/enroll`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(404);
  });

  it('should return 403 when viewing lessons before enrollment', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'fresh@test.com', password: 'password', role: 'student' });

    const freshRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'fresh@test.com', password: 'password' });
    const freshToken = freshRes.body.access_token;

    await request(app.getHttpServer())
      .get(`/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${freshToken}`)
      .expect(403);
  });
});
