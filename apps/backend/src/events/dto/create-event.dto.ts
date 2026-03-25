import * as yup from 'yup';

export const createEventSchema = yup.object({
  title: yup.string().required("Name is required").min(2, "Name is too short"),
  description: yup.string().optional(),
  startsAt: yup.date().required("Start date is required"),
  endsAt: yup.date().nullable().optional(),
  location: yup.string().required("Location is required"),
  capacity: yup.number().integer().nullable().optional(),
  visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
  tagIds: yup.array().of(yup.string()).max(5, 'Maximum 5 tags').optional()
});

export class CreateEventDto {
  title!: string;
  description?: string;
  startsAt!: Date;
  endsAt?: Date;
  location!: string;
  capacity?: number;
  visibility!: 'PUBLIC' | 'PRIVATE';
  tagIds?: string[];
}