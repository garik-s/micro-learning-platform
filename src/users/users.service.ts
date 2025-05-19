import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(user: { sub: number }) {
    return this.prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }
}
