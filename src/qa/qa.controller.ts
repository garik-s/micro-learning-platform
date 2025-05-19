import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QAService } from './qa.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RequestWithUser } from '../common/interfaces/request.interface';

@Controller('')
export class QAController {
  constructor(private readonly qaService: QAService) {}

  @Post('lessons/:lessonId/questions')
  @UseGuards(JwtAuthGuard)
  createQuestion(
    @Param('lessonId') lessonId: string,
    @Body() dto: CreateQuestionDto,
    @Req() req: RequestWithUser,
  ) {
    return this.qaService.createQuestion(+lessonId, dto, req.user.sub);
  }

  @Post('questions/:questionId/answer')
  @UseGuards(JwtAuthGuard)
  createAnswer(
    @Param('questionId') questionId: string,
    @Body() dto: CreateAnswerDto,
    @Req() req: RequestWithUser,
  ) {
    return this.qaService.createAnswer(+questionId, dto, req.user.sub);
  }
}
