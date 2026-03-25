import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly vibecoinPromoCode = (process.env.VIBECOIN_PROMO_CODE || 'VIBE10').toUpperCase();
  private readonly vibecoinPromoAmount = 10;
  private readonly creatorPageCreateCost = 2;
  private readonly creatorPageSlugRenameCost = 2;
  private readonly creatorPageSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  private normalizeDisplayName(rawName: string) {
    const name = (rawName || '').trim();
    if (name.length < 2 || name.length > 60) {
      throw new BadRequestException('Display name must be 2-60 characters long');
    }
    return name;
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateDisplayName(userId: string, rawName: string) {
    const name = this.normalizeDisplayName(rawName);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        vibecoins: true,
      },
    });

    return user;
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

  private normalizeSlug(rawSlug: string) {
    const slug = (rawSlug || '').trim().toLowerCase();
    if (!slug) {
      throw new BadRequestException('Slug is required');
    }
    if (!this.creatorPageSlugPattern.test(slug)) {
      throw new BadRequestException('Slug must contain only lowercase letters, numbers and hyphens');
    }
    if (slug.length < 3 || slug.length > 50) {
      throw new BadRequestException('Slug must be 3-50 characters long');
    }
    return slug;
  }

  private normalizeTitle(rawTitle: string) {
    const title = (rawTitle || '').trim();
    if (!title) {
      throw new BadRequestException('Title is required');
    }
    if (title.length < 3 || title.length > 100) {
      throw new BadRequestException('Title must be 3-100 characters long');
    }
    return title;
  }

  private normalizeDescription(rawDescription?: string | null) {
    const description = (rawDescription ?? '').trim();
    if (!description) return null;
    if (description.length > 500) {
      throw new BadRequestException('Description must be 500 characters or less');
    }
    return description;
  }

  private isArchived(event: { startsAt: Date | string; endsAt?: Date | string | null }, now = new Date()) {
    const endOrStart = event.endsAt ? new Date(event.endsAt) : new Date(event.startsAt);
    return endOrStart.getTime() < now.getTime();
  }

  private normalizeCreatorPageConflict(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Slug already in use');
    }
    throw error;
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
        tags: { include: { tag: true } },
      },
    });
  }

  async getCreatorPageBySlug(rawSlug: string, archived = false) {
    const slug = this.normalizeSlug(rawSlug);
    const page = await this.prisma.creatorPage.findUnique({
      where: { slug },
      include: {
        organizer: { select: { id: true, email: true, name: true } },
      },
    });

    if (!page) {
      throw new NotFoundException('Creator page not found');
    }

    const now = new Date();
    const events = await this.prisma.event.findMany({
      where: {
        AND: [
          { organizerId: page.organizerId },
          { visibility: 'PUBLIC' },
          this.buildArchiveWhere(archived, now),
        ],
      },
      orderBy: { startsAt: 'asc' },
      include: {
        participants: true,
        organizer: { select: { id: true, email: true, name: true } },
        tags: { include: { tag: true } },
      },
    });

    return {
      ...page,
      events: events.map((event) => ({
        ...event,
        tags: event.tags.map((eventTag) => eventTag.tag),
        creator: event.organizer,
        joined: false,
        isArchived: this.isArchived(event, now),
      })),
    };
  }

  async getMyCreatorPage(userId: string) {
    return this.prisma.creatorPage.findUnique({
      where: { organizerId: userId },
    });
  }

  async createMyCreatorPage(
    userId: string,
    payload: { slug: string; title: string; description?: string | null },
  ) {
    const slug = this.normalizeSlug(payload.slug);
    const title = this.normalizeTitle(payload.title);
    const description = this.normalizeDescription(payload.description);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const [user, existingPage] = await Promise.all([
          tx.user.findUnique({ where: { id: userId }, select: { vibecoins: true } }),
          tx.creatorPage.findUnique({ where: { organizerId: userId } }),
        ]);

        if (!user) {
          throw new NotFoundException('User not found');
        }
        if (existingPage) {
          throw new ConflictException('Creator page already exists');
        }
        if (user.vibecoins < this.creatorPageCreateCost) {
          throw new ForbiddenException('Not enough vibecoins');
        }

        const [creatorPage, updatedUser] = await Promise.all([
          tx.creatorPage.create({
            data: {
              organizerId: userId,
              slug,
              title,
              description,
            },
          }),
          tx.user.update({
            where: { id: userId },
            data: { vibecoins: { decrement: this.creatorPageCreateCost } },
            select: { vibecoins: true },
          }),
        ]);

        return {
          creatorPage,
          vibecoins: updatedUser.vibecoins,
          spent: this.creatorPageCreateCost,
        };
      });
    } catch (error) {
      this.normalizeCreatorPageConflict(error);
    }
  }

  async updateMyCreatorPage(
    userId: string,
    payload: { title: string; description?: string | null },
  ) {
    const title = this.normalizeTitle(payload.title);
    const description = this.normalizeDescription(payload.description);

    const existingPage = await this.prisma.creatorPage.findUnique({
      where: { organizerId: userId },
    });
    if (!existingPage) {
      throw new NotFoundException('Creator page not found');
    }

    return this.prisma.creatorPage.update({
      where: { organizerId: userId },
      data: {
        title,
        description,
      },
    });
  }

  async renameMyCreatorPageSlug(userId: string, rawSlug: string) {
    const slug = this.normalizeSlug(rawSlug);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const [user, page] = await Promise.all([
          tx.user.findUnique({ where: { id: userId }, select: { vibecoins: true } }),
          tx.creatorPage.findUnique({ where: { organizerId: userId } }),
        ]);

        if (!user) {
          throw new NotFoundException('User not found');
        }
        if (!page) {
          throw new NotFoundException('Creator page not found');
        }

        if (page.slug === slug) {
          return {
            creatorPage: page,
            vibecoins: user.vibecoins,
            spent: 0,
          };
        }

        if (user.vibecoins < this.creatorPageSlugRenameCost) {
          throw new ForbiddenException('Not enough vibecoins');
        }

        const [creatorPage, updatedUser] = await Promise.all([
          tx.creatorPage.update({
            where: { organizerId: userId },
            data: { slug },
          }),
          tx.user.update({
            where: { id: userId },
            data: { vibecoins: { decrement: this.creatorPageSlugRenameCost } },
            select: { vibecoins: true },
          }),
        ]);

        return {
          creatorPage,
          vibecoins: updatedUser.vibecoins,
          spent: this.creatorPageSlugRenameCost,
        };
      });
    } catch (error) {
      this.normalizeCreatorPageConflict(error);
    }
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
