import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  private buildArchiveWhere(archived: boolean, now = new Date()) {
    return archived
      ? {
          OR: [
            { endsAt: { lt: now } },
            { endsAt: null, startsAt: { lt: now } },
          ],
        }
      : {
          OR: [
            { endsAt: { gte: now } },
            { endsAt: null, startsAt: { gte: now } },
          ],
        };
  }

  async eventsForUser(userId: string, archived = false) {
    const now = new Date();
    return this.prisma.event.findMany({
      where: {
        OR: [
          { organizerId: userId },
          { participants: { some: { userId } } }
        ],
        ...this.buildArchiveWhere(archived, now),
      },
      include: {
        participants: true,
        tags: { include: { tag: true } }
      }
    });
  }
}
