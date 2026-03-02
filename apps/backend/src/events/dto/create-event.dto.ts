import * as yup from 'yup';

export const createEventSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().optional(),
  startsAt: yup.date().required(),
  endsAt: yup.date().min(yup.ref('startsAt')).optional(),
  location: yup.string().required(),
  capacity: yup.number().integer().positive().optional(),
  visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']).required()
});

export class CreateEventDto {
  title!: string;
  description?: string;
  startsAt!: Date;
  endsAt?: Date;
  location!: string;
  capacity?: number;
  visibility!: 'PUBLIC' | 'PRIVATE';
}
