import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    eventsForUser(userId: string): Promise<{
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
    }[]>;
}
