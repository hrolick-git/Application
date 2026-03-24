import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { PrismaService } from "../prisma.service";

const organizerSelect = {
  id: true,
  email: true,
  name: true,
  creatorPage: { select: { slug: true } },
} as const;

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  private readonly allowedColorThemes = new Set([
    "violet",
    "mint",
    "sky",
    "sunset",
    "blossom",
  ]);

  private readonly allowedIconPatterns = new Set([
    "tech",
    "art",
    "business",
    "music",
    "sport",
    "food",
    "game",
    "other",
  ]);

  private normalizeColorTheme(theme: string) {
    const normalizedTheme = (theme || "").toLowerCase().trim();
    if (!this.allowedColorThemes.has(normalizedTheme)) {
      throw new BadRequestException("Invalid color theme");
    }
    return normalizedTheme;
  }

  private normalizeIconPattern(pattern: string) {
    const normalized = (pattern || "").toLowerCase().trim();
    if (!this.allowedIconPatterns.has(normalized)) {
      throw new BadRequestException("Invalid icon pattern");
    }
    return normalized;
  }

  private createShareToken() {
    return randomBytes(24).toString("hex");
  }

  private isArchived(event: any, now = new Date()) {
    const endOrStart = event.endsAt
      ? new Date(event.endsAt)
      : new Date(event.startsAt);
    return endOrStart.getTime() < now.getTime();
  }

  private isPrivateEventAccessible(event: any, userId?: string) {
    return !!userId && (
      event.organizerId === userId ||
      event.participants.some((participant: any) => participant.userId === userId)
    );
  }

  private serializeEvent(event: any, userId?: string, now = new Date()) {
    const plainEvent = JSON.parse(JSON.stringify(event));
    const { shareToken, organizer, ...eventData } = plainEvent;
    const includeShareToken =
      !!userId &&
      eventData.visibility === "PRIVATE" &&
      eventData.organizerId === userId &&
      !!shareToken;

    return {
      ...eventData,
      joined: userId
        ? eventData.participants.some((participant: any) => participant.userId === userId)
        : false,
      isArchived: this.isArchived(eventData, now),
      tags: eventData.tags.map((eventTag: any) => eventTag.tag),
      creator: organizer
        ? {
            id: organizer.id,
            email: organizer.email,
            name: organizer.name,
            creatorPageSlug: organizer.creatorPage?.slug ?? null,
          }
        : null,
      ...(includeShareToken ? { shareToken } : {}),
    };
  }

  private async ensureShareTokenForPrivateOrganizerEvent(event: any, userId?: string) {
    if (
      !userId ||
      event.visibility !== "PRIVATE" ||
      event.organizerId !== userId ||
      !!event.shareToken
    ) {
      return event;
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id: event.id },
      data: { shareToken: this.createShareToken() },
      include: {
        participants: { include: { user: true } },
        organizer: { select: organizerSelect },
        tags: { include: { tag: true } },
      },
    });

    return updatedEvent;
  }

  private buildArchiveWhere(archived: boolean, now = new Date()) {
    const archivedOrActive = archived
      ? [{ endsAt: { lt: now } }, { endsAt: null, startsAt: { lt: now } }]
      : [{ endsAt: { gte: now } }, { endsAt: null, startsAt: { gte: now } }];

    return { OR: archivedOrActive };
  }

  private withComputedFlags(events: any[], userId?: string, now = new Date()) {
    return events.map((event: any) => this.serializeEvent(event, userId, now));
  }

  async list(userId?: string, tagIds?: string[], archived = false) {
    const now = new Date();
    const accessWhere = {
      OR: [
        { visibility: "PUBLIC" as const },
        ...(userId ? [{ organizerId: userId }] : []),
        ...(userId
          ? [{ visibility: "PRIVATE" as const, participants: { some: { userId } } }]
          : []),
      ],
    };
    const tagsWhere = tagIds?.length
      ? { tags: { some: { tagId: { in: tagIds } } } }
      : null;
    const whereClauses = tagsWhere
      ? [accessWhere, this.buildArchiveWhere(archived, now), tagsWhere]
      : [accessWhere, this.buildArchiveWhere(archived, now)];

    const events = await this.prisma.event.findMany({
      where: {
        AND: whereClauses,
      },
      orderBy: { startsAt: "asc" },
      include: {
        participants: true,
        organizer: { select: organizerSelect },
        tags: { include: { tag: true } },
      },
    });

    return this.withComputedFlags(events, userId, now);
  }

  async get(id: string, userId?: string) {
    let event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        participants: { include: { user: true } },
        organizer: { select: organizerSelect },
        tags: { include: { tag: true } },
      },
    });
    if (!event) throw new NotFoundException("Event not found");

    if (
      event.visibility === "PRIVATE" &&
      !this.isPrivateEventAccessible(event, userId)
    ) {
      throw new ForbiddenException("Access denied");
    }

    event = await this.ensureShareTokenForPrivateOrganizerEvent(event, userId);

    return this.serializeEvent(event, userId);
  }

  async findSharedEvent(shareToken: string) {
    const event = await this.prisma.event.findUnique({
      where: { shareToken },
      include: {
        participants: { include: { user: true } },
        organizer: { select: organizerSelect },
        tags: { include: { tag: true } },
      },
    });

    if (!event || event.visibility !== "PRIVATE") {
      throw new NotFoundException("Event not found");
    }

    return this.serializeEvent(event);
  }

  async create(data: any, userId: string) {
    if (new Date(data.startsAt) < new Date()) {
      throw new ForbiddenException("Cannot create an event in the past");
    }

    const { tagIds, colorTheme: _ignoredColorTheme, ...eventData } = data;

    const event = await this.prisma.event.create({
      data: {
        ...eventData,
        organizerId: userId,
        colorTheme: null,
        shareToken:
          eventData.visibility === "PRIVATE" ? this.createShareToken() : null,
        ...(tagIds?.length
          ? {
              tags: {
                create: tagIds.map((tagId: string) => ({ tagId })),
              },
            }
          : {}),
      },
      include: {
        participants: true,
        organizer: { select: organizerSelect },
        tags: { include: { tag: true } },
      },
    });

    return this.serializeEvent(event, userId);
  }

  async update(id: string, data: any, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");
    if (event.organizerId !== userId)
      throw new ForbiddenException("Access denied");

    const { tagIds, colorTheme: _ignoredColorTheme, ...eventData } = data;
    const nextVisibility = eventData.visibility ?? event.visibility;
    const shareTokenData =
      nextVisibility === "PRIVATE"
        ? { shareToken: event.shareToken ?? this.createShareToken() }
        : { shareToken: null };

    if (tagIds !== undefined) {
      // видалити старі теги і додати нові
      await this.prisma.eventTag.deleteMany({ where: { eventId: id } });
      if (tagIds.length > 0) {
        await this.prisma.eventTag.createMany({
          data: tagIds.map((tagId: string) => ({ eventId: id, tagId })),
        });
      }
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        ...shareTokenData,
      },
      include: {
        participants: true,
        organizer: { select: organizerSelect },
        tags: { include: { tag: true } },
      },
    });

    return this.serializeEvent(updated, userId);
  }

  async delete(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");
    if (event.organizerId !== userId)
      throw new ForbiddenException("Access denied");
    return this.prisma.event.delete({ where: { id } });
  }

  async join(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { participants: true },
    });
    if (!event) throw new NotFoundException("Event not found");
    if (
      event.visibility === "PRIVATE" &&
      event.organizerId !== userId &&
      !event.participants.some((participant) => participant.userId === userId)
    ) {
      throw new ForbiddenException("Access denied");
    }
    if (event.capacity && event.participants.length >= event.capacity) {
      throw new ForbiddenException("Event is full");
    }
    if (event.participants.some((p) => p.userId === userId)) return event;
    return this.prisma.participant.create({ data: { eventId: id, userId } });
  }

  async joinByShareToken(shareToken: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { shareToken },
      include: { participants: true },
    });

    if (!event || event.visibility !== "PRIVATE") {
      throw new NotFoundException("Event not found");
    }
    if (event.capacity && event.participants.length >= event.capacity) {
      throw new ForbiddenException("Event is full");
    }
    if (event.participants.some((participant) => participant.userId === userId)) {
      return event;
    }

    return this.prisma.participant.create({
      data: { eventId: event.id, userId },
    });
  }

  async getOrCreateShareToken(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");
    if (event.organizerId !== userId) {
      throw new ForbiddenException("Access denied");
    }
    if (event.visibility !== "PRIVATE") {
      throw new ForbiddenException("Share link is available only for private events");
    }

    if (event.shareToken) {
      return { shareToken: event.shareToken };
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: { shareToken: this.createShareToken() },
      select: { shareToken: true },
    });

    return { shareToken: updated.shareToken };
  }

  async changeTheme(id: string, userId: string, theme?: string | null) {
    const normalizedTheme = theme && theme.trim() ? this.normalizeColorTheme(theme) : null;

    const result = await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id },
        include: {
          participants: true,
          organizer: { select: organizerSelect },
          tags: { include: { tag: true } },
        },
      });
      if (!event) throw new NotFoundException("Event not found");
      if (event.organizerId !== userId) {
        throw new ForbiddenException("Only organizer can change event theme");
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { vibecoins: true },
      });
      if (!user) throw new NotFoundException("User not found");

      if (event.colorTheme === normalizedTheme) {
        return {
          event,
          vibecoins: user.vibecoins,
          spent: 0,
        };
      }

      if (normalizedTheme === null) {
        const updatedEvent = await tx.event.update({
          where: { id },
          data: { colorTheme: null },
          include: {
            participants: true,
            organizer: { select: organizerSelect },
            tags: { include: { tag: true } },
          },
        });

        return {
          event: updatedEvent,
          vibecoins: user.vibecoins,
          spent: 0,
        };
      }

      if (user.vibecoins < 1) {
        throw new ForbiddenException("Not enough vibecoins");
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { vibecoins: { decrement: 1 } },
        select: { vibecoins: true },
      });

      const updatedEvent = await tx.event.update({
        where: { id },
        data: { colorTheme: normalizedTheme },
        include: {
          participants: true,
          organizer: { select: organizerSelect },
          tags: { include: { tag: true } },
        },
      });

      return {
        event: updatedEvent,
        vibecoins: updatedUser.vibecoins,
        spent: 1,
      };
    });

    return {
      event: this.serializeEvent(result.event, userId),
      vibecoins: result.vibecoins,
      spent: result.spent,
    };
  }

  async changeIconPattern(id: string, userId: string, pattern?: string | null) {
    const normalizedPattern = pattern && pattern.trim() ? this.normalizeIconPattern(pattern) : null;

    const result = await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id },
        include: {
          participants: true,
          organizer: { select: organizerSelect },
          tags: { include: { tag: true } },
        },
      });
      if (!event) throw new NotFoundException("Event not found");
      if (event.organizerId !== userId) {
        throw new ForbiddenException("Only organizer can change icon pattern");
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { vibecoins: true },
      });
      if (!user) throw new NotFoundException("User not found");

      if (event.iconPattern === normalizedPattern) {
        return { event, vibecoins: user.vibecoins, spent: 0 };
      }

      if (normalizedPattern === null) {
        const updatedEvent = await tx.event.update({
          where: { id },
          data: { iconPattern: null },
          include: {
            participants: true,
            organizer: { select: organizerSelect },
            tags: { include: { tag: true } },
          },
        });
        return { event: updatedEvent, vibecoins: user.vibecoins, spent: 0 };
      }

      if (user.vibecoins < 1) {
        throw new ForbiddenException("Not enough vibecoins");
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { vibecoins: { decrement: 1 } },
        select: { vibecoins: true },
      });

      const updatedEvent = await tx.event.update({
        where: { id },
        data: { iconPattern: normalizedPattern },
        include: {
          participants: true,
          organizer: { select: organizerSelect },
          tags: { include: { tag: true } },
        },
      });

      return { event: updatedEvent, vibecoins: updatedUser.vibecoins, spent: 1 };
    });

    return {
      event: this.serializeEvent(result.event, userId),
      vibecoins: result.vibecoins,
      spent: result.spent,
    };
  }

  async leave(id: string, userId: string) {
    return this.prisma.participant.delete({
      where: { userId_eventId: { userId, eventId: id } },
    });
  }

  async findPublicEvents(tagIds?: string[], archived = false) {
    const now = new Date();
    const tagsWhere = tagIds?.length
      ? { tags: { some: { tagId: { in: tagIds } } } }
      : null;
    const whereClauses = tagsWhere
      ? [{ visibility: "PUBLIC" as const }, this.buildArchiveWhere(archived, now), tagsWhere]
      : [{ visibility: "PUBLIC" as const }, this.buildArchiveWhere(archived, now)];

    const events = await this.prisma.event.findMany({
      where: {
        AND: whereClauses,
      },
      orderBy: { startsAt: "asc" },
      include: {
        participants: true,
        organizer: { select: organizerSelect },
        tags: { include: { tag: true } },
      },
    });

    return this.withComputedFlags(events, undefined, now);
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { select: organizerSelect },
        participants: {
          include: {
            user: { select: { email: true, id: true } },
          },
        },
        tags: { include: { tag: true } },
      },
    });
    if (!event) return null;
    return this.serializeEvent(event);
  }

  /** Get all available tags */
  async getTags() {
    return this.prisma.tag.findMany({ orderBy: { name: "asc" } });
  }
}
