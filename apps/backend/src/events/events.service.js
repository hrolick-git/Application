"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId) {
        const events = await this.prisma.event.findMany({
            where: {
                OR: [
                    { visibility: 'PUBLIC' },
                    ...(userId ? [{ organizerId: userId }] : []),
                ],
            },
            orderBy: { startsAt: 'asc' },
            include: { participants: true },
        });
        return JSON.parse(JSON.stringify(events)).map((e) => ({
            ...e,
            joined: userId ? e.participants.some((p) => p.userId === userId) : false,
        }));
    }
    async get(id, userId) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: { participants: { include: { user: true } } },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (event.visibility === 'PRIVATE') {
            const ok = event.organizerId === userId ||
                event.participants.some((p) => p.userId === userId);
            if (!ok)
                throw new common_1.ForbiddenException('Access denied');
        }
        return event;
    }
    async create(data, userId) {
        if (new Date(data.startsAt) < new Date()) {
            throw new common_1.ForbiddenException('Cannot create an event in the past');
        }
        return this.prisma.event.create({
            data: { ...data, organizerId: userId },
            include: { participants: true }
        });
    }
    async update(id, data, userId) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (event.organizerId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        return this.prisma.event.update({ where: { id }, data });
    }
    async delete(id, userId) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (event.organizerId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        return this.prisma.event.delete({ where: { id } });
    }
    async join(id, userId) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: { participants: true },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (event.capacity && event.participants.length >= event.capacity) {
            throw new common_1.ForbiddenException('Event is full');
        }
        if (event.participants.some(p => p.userId === userId))
            return event;
        return this.prisma.participant.create({ data: { eventId: id, userId } });
    }
    async leave(id, userId) {
        return this.prisma.participant.delete({
            where: { userId_eventId: { userId, eventId: id } },
        });
    }
    async findPublicEvents() {
        const events = await this.prisma.event.findMany({
            where: { visibility: 'PUBLIC' },
            orderBy: { startsAt: 'asc' },
            include: { participants: true },
        });
        return JSON.parse(JSON.stringify(events));
    }
    async findById(id) {
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map