import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async list(userId?: string) {
    const events = await this.prisma.event.findMany({
      where: { visibility: 'PUBLIC' },
      include: { participants: true }
    });
    if (userId) {
      return events.map((e: any) => ({
        ...e,
        joined: e.participants.some((p: any) => p.userId === userId),
        full: e.capacity ? e.participants.length >= e.capacity : false
      }));
    }
    return events;
  }

  async get(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { participants: { include: { user: true } } }
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.visibility === 'PRIVATE') {
      const ok =
        event.organizerId === userId ||
        event.participants.some((p: any) => p.userId === userId);
      if (!ok) throw new ForbiddenException();
    }
    return event;
  }

  async create(data: any, userId: string) {
    if (new Date(data.startsAt) < new Date()) {
      throw new ForbiddenException('Cannot create in past');
    }
    return this.prisma.event.create({ data: { ...data, organizerId: userId } });
  }

  async update(id: string, data: any, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException();
    if (event.organizerId !== userId) throw new ForbiddenException();
    return this.prisma.event.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException();
    if (event.organizerId !== userId) throw new ForbiddenException();
    return this.prisma.event.delete({ where: { id } });
  }

  async join(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { participants: true }
    });
    if (!event) throw new NotFoundException();
    if (event.capacity && event.participants.length >= event.capacity) {
      throw new ForbiddenException('Event full');
    }
    return this.prisma.participant.create({
      data: { eventId: id, userId }
    });
  }

  async leave(id: string, userId: string) {
    return this.prisma.participant.delete({
      where: { userId_eventId: { userId, eventId: id } }
    });
  }
}
