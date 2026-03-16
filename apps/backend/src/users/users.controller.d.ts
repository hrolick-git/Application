import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        id: string;
        email: string;
    } | null>;
    getMyEvents(req: any): Promise<{
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
