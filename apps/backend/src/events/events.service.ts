import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  /** Список подій для користувача або публічних */
  async list(userId?: string) {
    const events = await this.prisma.event.findMany({
      where: {
        OR: [
          { visibility: 'PUBLIC' },
          ...(userId ? [{ organizerId: userId }] : []),
        ],
      },
      orderBy: { startsAt: 'asc' },
      include: { participants: true }, // Prisma тягне дані
    });

    return JSON.parse(JSON.stringify(events)).map((e: any) => ({
      ...e,
      joined: userId ? e.participants.some((p: any) => p.userId === userId) : false,
    }));
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
    return this.prisma.event.create({ 
      data: { ...data, organizerId: userId },
      include: { participants: true } // ДОДАЄМО ТУТ
    });
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
    const events = await this.prisma.event.findMany({
      where: { visibility: 'PUBLIC' },
      orderBy: { startsAt: 'asc' },
      include: { participants: true }, // ОБОВ'ЯЗКОВО ДОДАЄМО ТУТ
    });

    return JSON.parse(JSON.stringify(events));
  }

  /** Отримати подію без авторизації */
  async findById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: { select: { email: true, id: true } }
          }
        }
      }
    });
  }
}