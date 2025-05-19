import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const ipRequestMap = new Map<string, number[]>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    const now = Date.now();
    const timestamps = ipRequestMap.get(ip) || [];

    const recentRequests = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
      throw new BadRequestException('Too many requests, slow down.');
    }

    recentRequests.push(now);
    ipRequestMap.set(ip, recentRequests);
    return true;
  }
}
