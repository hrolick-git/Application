import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly vibecoinPromoCode = (process.env.VIBECOIN_PROMO_CODE || 'VIBE10').toUpperCase();
  private readonly vibecoinPromoAmount = 10;

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  private buildArchiveWhere(archived: boolean, now = new Date()) {
    const archivedOrActive = archived
      ? [
          { endsAt: { lt: now } },
          { endsAt: null, startsAt: { lt: now } },
        ]
      : [
          { endsAt: { gte: now } },
          { endsAt: null, startsAt: { gte: now } },
        ];

    return { OR: archivedOrActive };
  }

  async eventsForUser(userId: string, archived = false) {
    const now = new Date();
    const accessWhere = {
      OR: [
        { organizerId: userId },
        { participants: { some: { userId } } },
      ],
    };

    return this.prisma.event.findMany({
      where: {
        AND: [
          accessWhere,
          this.buildArchiveWhere(archived, now),
        ],
      },
      include: {
        participants: true,
        tags: { include: { tag: true } }
      }
    });
  }

  async redeemVibecoinCode(userId: string, rawCode: string) {
    const code = (rawCode || '').trim().toUpperCase();
    if (!code) {
      throw new BadRequestException('Code is required');
    }
    if (code !== this.vibecoinPromoCode) {
      throw new ForbiddenException('Invalid promo code');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, vibecoins: true },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingRedemption = await tx.vibecoinRedemption.findUnique({
        where: {
          userId_code: {
            userId,
            code,
          },
        },
      });
      if (existingRedemption) {
        throw new ConflictException('Code already used');
      }

      await tx.vibecoinRedemption.create({
        data: {
          userId,
          code,
          amount: this.vibecoinPromoAmount,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { vibecoins: { increment: this.vibecoinPromoAmount } },
        select: {
          id: true,
          email: true,
          name: true,
          vibecoins: true,
        },
      });

      return {
        user: updatedUser,
        added: this.vibecoinPromoAmount,
        code,
      };
    });

    return result;
  }
}
