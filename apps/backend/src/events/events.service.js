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
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.allowedColorThemes = new Set([
            "violet",
            "mint",
            "sky",
            "sunset",
            "blossom",
        ]);
    }
    normalizeColorTheme(theme) {
        const normalizedTheme = (theme || "").toLowerCase().trim();
        if (!this.allowedColorThemes.has(normalizedTheme)) {
            throw new common_1.BadRequestException("Invalid color theme");
        }
        return normalizedTheme;
    }
    createShareToken() {
        return (0, crypto_1.randomBytes)(24).toString("hex");
    }
    isArchived(event, now = new Date()) {
        const endOrStart = event.endsAt ? new Date(event.endsAt) : new Date(event.startsAt);
        return endOrStart.getTime() < now.getTime();
    }
    isPrivateEventAccessible(event, userId) {
        return !!userId && (event.organizerId === userId ||
            event.participants.some((participant) => participant.userId === userId));
    }
    serializeEvent(event, userId, now = new Date()) {
        const plainEvent = JSON.parse(JSON.stringify(event));
        const { shareToken, ...eventData } = plainEvent;
        const includeShareToken = !!userId &&
            eventData.visibility === "PRIVATE" &&
            eventData.organizerId === userId &&
            !!shareToken;
        return {
            ...eventData,
            joined: userId
                ? eventData.participants.some((participant) => participant.userId === userId)
                : false,
            isArchived: this.isArchived(eventData, now),
            tags: eventData.tags.map((eventTag) => eventTag.tag),
            ...(includeShareToken ? { shareToken } : {}),
        };
    }
    async ensureShareTokenForPrivateOrganizerEvent(event, userId) {
        if (!userId ||
            event.visibility !== "PRIVATE" ||
            event.organizerId !== userId ||
            !!event.shareToken) {
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
    buildArchiveWhere(archived, now = new Date()) {
        const archivedOrActive = archived
            ? [{ endsAt: { lt: now } }, { endsAt: null, startsAt: { lt: now } }]
            : [{ endsAt: { gte: now } }, { endsAt: null, startsAt: { gte: now } }];
        return { OR: archivedOrActive };
    }
    withComputedFlags(events, userId, now = new Date()) {
        return events.map((event) => this.serializeEvent(event, userId, now));
    }
    async list(userId, tagIds, archived = false) {
        const now = new Date();
        const accessWhere = {
            OR: [
                { visibility: "PUBLIC" },
                ...(userId ? [{ organizerId: userId }] : []),
                ...(userId
                    ? [{ visibility: "PRIVATE", participants: { some: { userId } } }]
                    : []),
            ],
        };
        const tagsWhere = tagIds === null || tagIds === void 0 ? void 0 : tagIds.length
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
    async get(id, userId) {
        let event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                participants: { include: { user: true } },
                tags: { include: { tag: true } },
            },
        });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        if (event.visibility === "PRIVATE" &&
            !this.isPrivateEventAccessible(event, userId)) {
            throw new common_1.ForbiddenException("Access denied");
        }
        event = await this.ensureShareTokenForPrivateOrganizerEvent(event, userId);
        return this.serializeEvent(event, userId);
    }
    async findSharedEvent(shareToken) {
        const event = await this.prisma.event.findUnique({
            where: { shareToken },
            include: {
                participants: { include: { user: true } },
                tags: { include: { tag: true } },
            },
        });
        if (!event || event.visibility !== "PRIVATE") {
            throw new common_1.NotFoundException("Event not found");
        }
        return this.serializeEvent(event);
    }
    async create(data, userId) {
        if (new Date(data.startsAt) < new Date()) {
            throw new common_1.ForbiddenException("Cannot create an event in the past");
        }
        const { tagIds, colorTheme: _ignoredColorTheme, ...eventData } = data;
        return this.prisma.event.create({
            data: {
                ...eventData,
                organizerId: userId,
                colorTheme: null,
                shareToken: eventData.visibility === "PRIVATE" ? this.createShareToken() : null,
                ...(tagIds === null || tagIds === void 0 ? void 0 : tagIds.length)
                    ? {
                        tags: {
                            create: tagIds.map((tagId) => ({ tagId })),
                        },
                    }
                    : {},
            },
            include: {
                participants: true,
                tags: { include: { tag: true } },
            },
        });
    }
    async update(id, data, userId) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        if (event.organizerId !== userId)
            throw new common_1.ForbiddenException("Access denied");
        const { tagIds, colorTheme: _ignoredColorTheme, ...eventData } = data;
        const nextVisibility = eventData.visibility !== undefined ? eventData.visibility : event.visibility;
        const shareTokenData = nextVisibility === "PRIVATE"
            ? { shareToken: event.shareToken || this.createShareToken() }
            : { shareToken: null };
        if (tagIds !== undefined) {
            await this.prisma.eventTag.deleteMany({ where: { eventId: id } });
            if (tagIds.length > 0) {
                await this.prisma.eventTag.createMany({
                    data: tagIds.map((tagId) => ({ eventId: id, tagId })),
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
    async delete(id, userId) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        if (event.organizerId !== userId)
            throw new common_1.ForbiddenException("Access denied");
        return this.prisma.event.delete({ where: { id } });
    }
    async join(id, userId) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: { participants: true },
        });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        if (event.visibility === "PRIVATE" &&
            event.organizerId !== userId &&
            !event.participants.some((participant) => participant.userId === userId)) {
            throw new common_1.ForbiddenException("Access denied");
        }
        if (event.capacity && event.participants.length >= event.capacity) {
            throw new common_1.ForbiddenException("Event is full");
        }
        if (event.participants.some((participant) => participant.userId === userId))
            return event;
        return this.prisma.participant.create({ data: { eventId: id, userId } });
    }
    async joinByShareToken(shareToken, userId) {
        const event = await this.prisma.event.findUnique({
            where: { shareToken },
            include: { participants: true },
        });
        if (!event || event.visibility !== "PRIVATE") {
            throw new common_1.NotFoundException("Event not found");
        }
        if (event.capacity && event.participants.length >= event.capacity) {
            throw new common_1.ForbiddenException("Event is full");
        }
        if (event.participants.some((participant) => participant.userId === userId)) {
            return event;
        }
        return this.prisma.participant.create({
            data: { eventId: event.id, userId },
        });
    }
    async getOrCreateShareToken(id, userId) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException("Event not found");
        if (event.organizerId !== userId) {
            throw new common_1.ForbiddenException("Access denied");
        }
        if (event.visibility !== "PRIVATE") {
            throw new common_1.ForbiddenException("Share link is available only for private events");
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
    async changeTheme(id, userId, theme) {
        const normalizedTheme = this.normalizeColorTheme(theme);
        const result = await this.prisma.$transaction(async (tx) => {
            const event = await tx.event.findUnique({
                where: { id },
                include: {
                    participants: true,
                    tags: { include: { tag: true } },
                },
            });
            if (!event)
                throw new common_1.NotFoundException("Event not found");
            if (event.organizerId !== userId) {
                throw new common_1.ForbiddenException("Only organizer can change event theme");
            }
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: { vibecoins: true },
            });
            if (!user)
                throw new common_1.NotFoundException("User not found");
            if (event.colorTheme === normalizedTheme) {
                return {
                    event,
                    vibecoins: user.vibecoins,
                    spent: 0,
                };
            }
            if (user.vibecoins < 1) {
                throw new common_1.ForbiddenException("Not enough vibecoins");
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
    async leave(id, userId) {
        return this.prisma.participant.delete({
            where: { userId_eventId: { userId, eventId: id } },
        });
    }
    async findPublicEvents(tagIds, archived = false) {
        const now = new Date();
        const tagsWhere = tagIds === null || tagIds === void 0 ? void 0 : tagIds.length
            ? { tags: { some: { tagId: { in: tagIds } } } }
            : null;
        const whereClauses = tagsWhere
            ? [{ visibility: "PUBLIC" }, this.buildArchiveWhere(archived, now), tagsWhere]
            : [{ visibility: "PUBLIC" }, this.buildArchiveWhere(archived, now)];
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
    async findById(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                participants: {
                    include: {
                        user: { select: { email: true, id: true } },
                    }
                },
                tags: { include: { tag: true } },
            },
        });
        if (!event)
            return null;
        return this.serializeEvent(event);
    }
    async getTags() {
        return this.prisma.tag.findMany({ orderBy: { name: "asc" } });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map