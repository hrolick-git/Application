import { PrismaService } from '../prisma.service';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(userId?: string): Promise<any>;
    get(id: string, userId?: string): Promise<{
        participants: ({
            user: {
                id: string;
                email: string;
                name: string | null;
                passwordHash: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            userId: string;
            eventId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        location: string;
        capacity: number | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        organizerId: string;
    }>;
    create(data: any, userId: string): Promise<{
        participants: {
            userId: string;
            eventId: string;
            joinedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        location: string;
        capacity: number | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        organizerId: string;
    }>;
    update(id: string, data: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        location: string;
        capacity: number | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        organizerId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        location: string;
        capacity: number | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        organizerId: string;
    }>;
    join(id: string, userId: string): Promise<{
        userId: string;
        eventId: string;
        joinedAt: Date;
    } | ({
        participants: {
            userId: string;
            eventId: string;
            joinedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        location: string;
        capacity: number | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        organizerId: string;
    })>;
    leave(id: string, userId: string): Promise<{
        userId: string;
        eventId: string;
        joinedAt: Date;
    }>;
    findPublicEvents(): Promise<any>;
    findById(id: string): Promise<({
        participants: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            userId: string;
            eventId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        location: string;
        capacity: number | null;
        visibility: import(".prisma/client").$Enums.Visibility;
        organizerId: string;
    }) | null>;
}
