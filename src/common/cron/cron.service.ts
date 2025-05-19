import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionCleanupJob {
  private readonly logger = new Logger(QuestionCleanupJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async archiveUnansweredQuestions() {
    try {
      const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);

      const result = await this.prisma.question.updateMany({
        where: {
          archived: false,
          answerId: null,
          createdAt: { lt: oneDayAgo },
        },
        data: {
          archived: true,
        },
      });

      this.logger.log(`Archived ${result.count} unanswered questions.`);
    } catch (error) {
      this.logger.error('Failed to archive unanswered questions', error);
    }
  }
}
