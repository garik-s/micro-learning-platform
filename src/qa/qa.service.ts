import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Question, Answer } from '../common/interfaces/qa.interface';

@Injectable()
export class QAService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(
    lessonId: number,
    dto: CreateQuestionDto,
    studentId: number,
  ): Promise<Question> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const question = await this.prisma.question.create({
      data: {
        content: dto.question,
        lessonId,
        studentId,
      },
      include: {
        answer: true,
      },
    });

    return question;
  }

  async createAnswer(
    questionId: number,
    dto: CreateAnswerDto,
    instructorId: number,
  ): Promise<Answer> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { answer: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.answer) {
      throw new ForbiddenException('Question already has an answer');
    }

    const answer = await this.prisma.answer.create({
      data: {
        content: dto.answer,
        instructorId,
      },
    });

    await this.prisma.question.update({
      where: { id: questionId },
      data: {
        answerId: answer.id,
      },
    });

    return answer;
  }
}
