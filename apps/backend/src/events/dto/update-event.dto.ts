import * as yup from 'yup';

export const updateEventSchema = yup.object({
  title: yup.string().optional(),
  description: yup.string().optional(),
  startsAt: yup.date().optional(),
  endsAt: yup.date().min(yup.ref('startsAt')).optional(),
  location: yup.string().optional(),
  capacity: yup.number().integer().positive().optional(),
  visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']).optional()
});

export class UpdateEventDto {
  title?: string;
  description?: string;
  startsAt?: Date;
  endsAt?: Date;
  location?: string;
  capacity?: number;
  visibility?: 'PUBLIC' | 'PRIVATE';
}
