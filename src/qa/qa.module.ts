import { Module } from '@nestjs/common';
import { QAService } from './qa.service';
import { QAController } from './qa.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Module({
  controllers: [QAController],
  providers: [QAService, PrismaService, JwtAuthGuard],
})
export class QAModule {}
