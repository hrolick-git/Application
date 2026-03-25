import * as yup from 'yup';
export declare const createEventSchema: yup.ObjectSchema<{
    title: string;
    description: string | undefined;
    startsAt: Date;
    endsAt: Date | null | undefined;
    location: string;
    capacity: number | null | undefined;
    visibility: "PUBLIC" | "PRIVATE";
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    startsAt: undefined;
    endsAt: undefined;
    location: undefined;
    capacity: undefined;
    visibility: "PUBLIC";
}, "">;
export declare class CreateEventDto {
    title: string;
    description?: string;
    startsAt: Date;
    endsAt?: Date;
    location: string;
    capacity?: number;
    visibility: 'PUBLIC' | 'PRIVATE';
}
