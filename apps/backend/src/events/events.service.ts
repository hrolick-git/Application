import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  private buildArchiveWhere(archived: boolean, now = new Date()) {
    const archivedOrActive = archived
      ? [{ endsAt: { lt: now } }, { endsAt: null, startsAt: { lt: now } }]
      : [{ endsAt: { gte: now } }, { endsAt: null, startsAt: { gte: now } }];

    return { OR: archivedOrActive };
  }

  private withComputedFlags(events: any[], userId?: string, now = new Date()) {
    return JSON.parse(JSON.stringify(events)).map((e: any) => {
      const endOrStart = e.endsAt ? new Date(e.endsAt) : new Date(e.startsAt);
      const isArchived = endOrStart.getTime() < now.getTime();
      return {
        ...e,
        joined: userId
          ? e.participants.some((p: any) => p.userId === userId)
          : false,
        isArchived,
        tags: e.tags.map((et: any) => et.tag),
      };
    });
  }

  async list(userId?: string, tagIds?: string[], archived = false) {
    const now = new Date();
    const accessWhere = {
      OR: [
        { visibility: "PUBLIC" as const },
        ...(userId ? [{ organizerId: userId }] : []),
      ],
    };
    const tagsWhere = tagIds?.length
      ? { tags: { some: { tagId: { in: tagIds } } } }
      : {};

    const events = await this.prisma.event.findMany({
      where: {
        AND: [accessWhere, this.buildArchiveWhere(archived, now), tagsWhere],
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
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        participants: { include: { user: true } },
        tags: { include: { tag: true } },
      },
    });
    if (!event) throw new NotFoundException("Event not found");

    if (event.visibility === "PRIVATE") {
      const ok =
        event.organizerId === userId ||
        event.participants.some((p: any) => p.userId === userId);
      if (!ok) throw new ForbiddenException("Access denied");
    }

    return {
      ...event,
      tags: event.tags.map((et: any) => et.tag),
    };
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
      data: eventData,
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
    if (event.capacity && event.participants.length >= event.capacity) {
      throw new ForbiddenException("Event is full");
    }
    if (event.participants.some((p) => p.userId === userId)) return event;
    return this.prisma.participant.create({ data: { eventId: id, userId } });
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
      : {};

    const events = await this.prisma.event.findMany({
      where: {
        AND: [
          { visibility: "PUBLIC" as const },
          this.buildArchiveWhere(archived, now),
          tagsWhere,
        ],
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
    return {
      ...event,
      tags: event.tags.map((et: any) => et.tag),
    };
  }

  /** Get all available tags */
  async getTags() {
    return this.prisma.tag.findMany({ orderBy: { name: "asc" } });
  }
}
