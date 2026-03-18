import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
}
