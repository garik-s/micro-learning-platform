import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const handler = context.getHandler().name;

    const roleRequirements: Record<string, string> = {
      createCourse: 'instructor',
      addLesson: 'instructor',
      enroll: 'student',
      listLessons: 'student',
    };

    const requiredRole = roleRequirements[handler];
    if (!requiredRole) return true;

    if (user.role !== requiredRole) {
      throw new ForbiddenException(`Only ${requiredRole}s can access this resource.`);
    }

    return true;
  }
}
