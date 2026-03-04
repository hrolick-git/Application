import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  /** Список подій для користувача або публічних */
  async list(userId?: string) {
    const events = await this.prisma.event.findMany({
      orderBy: { startsAt: 'asc' },
      include: { participants: true },
    });

    return events.map((e) => {
      const isJoined = userId ? e.participants.some(p => p.userId === userId) : false;
      const isFull = e.capacity ? e.participants.length >= e.capacity : false;
      return { ...e, joined: isJoined, full: isFull };
    });
  }

  /** Отримати конкретну подію */
  async get(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { participants: { include: { user: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');

    if (event.visibility === 'PRIVATE') {
      const ok =
        event.organizerId === userId ||
        event.participants.some((p: any) => p.userId === userId);
      if (!ok) throw new ForbiddenException('Доступ заборонено');
    }

    return event;
  }

  /** Створити подію */
  async create(data: any, userId: string) {
    if (new Date(data.startsAt) < new Date()) {
      throw new ForbiddenException('Не можна створити подію у минулому');
    }
    return this.prisma.event.create({ data: { ...data, organizerId: userId } });
  }

  /** Редагувати */
  async update(id: string, data: any, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Подія не знайдена');
    if (event.organizerId !== userId) throw new ForbiddenException('Доступ заборонено');
    return this.prisma.event.update({ where: { id }, data });
  }

  /** Видалити */
  async delete(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Подія не знайдена');
    if (event.organizerId !== userId) throw new ForbiddenException('Доступ заборонено');
    return this.prisma.event.delete({ where: { id } });
  }

  /** Join */
  async join(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { participants: true },
    });
    if (!event) throw new NotFoundException('Подія не знайдена');
    if (event.capacity && event.participants.length >= event.capacity) {
      throw new ForbiddenException('Подія заповнена');
    }
    if (event.participants.some(p => p.userId === userId)) return event;
    return this.prisma.participant.create({ data: { eventId: id, userId } });
  }

  /** Leave */
  async leave(id: string, userId: string) {
    return this.prisma.participant.delete({
      where: { userId_eventId: { userId, eventId: id } },
    });
  }

  /** Публічні події */
  async findPublicEvents() {
    return this.prisma.event.findMany({
      where: { visibility: 'PUBLIC' },
      orderBy: { startsAt: 'asc' },
      include: { participants: true },
    });
  }

  /** Отримати подію без авторизації */
  async findById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { participants: { include: { user: true } } },
    });
  }
}