import * as yup from 'yup';
export declare const updateEventSchema: yup.ObjectSchema<{
    title: string | undefined;
    description: string | null | undefined;
    startsAt: Date | undefined;
    endsAt: Date | null | undefined;
    location: string | undefined;
    capacity: number | null | undefined;
    visibility: "PUBLIC" | "PRIVATE" | undefined;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    startsAt: undefined;
    endsAt: undefined;
    location: undefined;
    capacity: undefined;
    visibility: undefined;
}, "">;
export declare class UpdateEventDto {
    title?: string;
    description?: string;
    startsAt?: Date;
    endsAt?: Date | null;
    location?: string;
    capacity?: number | null;
    visibility?: 'PUBLIC' | 'PRIVATE';
}
