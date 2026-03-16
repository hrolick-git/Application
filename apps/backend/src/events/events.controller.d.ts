import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly events;
    constructor(events: EventsService);
    publicList(): Promise<any>;
    publicEvent(id: string): Promise<{
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
    }>;
    list(req: any): Promise<any>;
    getById(id: string, req: any): Promise<{
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
    create(dto: CreateEventDto, req: any): Promise<{
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
    update(id: string, dto: UpdateEventDto, req: any): Promise<{
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
    delete(id: string, req: any): Promise<{
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
    join(id: string, req: any): Promise<{
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
    leave(id: string, req: any): Promise<{
        userId: string;
        eventId: string;
        joinedAt: Date;
    }>;
}
