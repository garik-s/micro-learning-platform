import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) { }

  async signup(dto: SignUpDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ForbiddenException('Email already in use');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hash, role: dto.role },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new ForbiddenException('Invalid credentials');

    const pwValid = await bcrypt.compare(dto.password, user.password);
    if (!pwValid) throw new ForbiddenException('Invalid credentials');

    return this.signToken(user.id, user.email, user.role);
  }

  private async signToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const token = await this.jwt.signAsync(payload);

    return { access_token: token };
  }
}
