import * as yup from 'yup';

export const createEventSchema = yup.object({
  title: yup.string().required("Назва обов'язкова"),
  description: yup.string().optional(),
  startsAt: yup.date().required("Дата початку обов'язкова"),
  endsAt: yup.date().nullable().optional(),
  location: yup.string().required("Локація обов'язкова"),
  capacity: yup.number().integer().nullable().optional(),
  visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
  tagIds: yup.array().of(yup.string()).max(5, 'Максимум 5 тегів').optional()
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