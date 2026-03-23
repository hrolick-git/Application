import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { PrismaService } from "../prisma.service";

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

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
    const { shareToken, ...eventData } = plainEvent;
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

    const { tagIds, ...eventData } = data;

    return this.prisma.event.create({
      data: {
        ...eventData,
        organizerId: userId,
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
        tags: { include: { tag: true } },
      },
    });
  }

  async update(id: string, data: any, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Event not found");
    if (event.organizerId !== userId)
      throw new ForbiddenException("Access denied");

    const { tagIds, ...eventData } = data;
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

    return this.prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        ...shareTokenData,
      },
      include: {
        participants: true,
        tags: { include: { tag: true } },
      },
    });
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
        tags: { include: { tag: true } },
      },
    });

    return this.withComputedFlags(events, undefined, now);
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
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
