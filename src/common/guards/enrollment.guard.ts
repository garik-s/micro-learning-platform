import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const courseId = parseInt(request.params.id);

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (!enrollment) throw new ForbiddenException('Not enrolled in course');
    return true;
  }
}
