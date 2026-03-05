import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(email: string, password: string, name: string) {
    const hash = await bcrypt.hash(password, 10);
    try {
      return await this.prisma.user.create({ data: { email, passwordHash: hash, name } });
    } catch (err: any) {
      // P2002 is Prisma unique constraint violation (email already exists)
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        throw new ConflictException('email already registered');
      }
      throw err;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('invalid credentials');
    
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('invalid credentials');
    
    const payload = { sub: user.id, email: user.email };
    
    return { 
      access_token: this.jwt.sign(payload),
      // ДОДАЄМО ОБ'ЄКТ USER ТУТ:
      user: {
        id: user.id,
        email: user.email,
        name: user.name // Тепер фронтенд побачить ім'я відразу
      }
    };
  }
}
