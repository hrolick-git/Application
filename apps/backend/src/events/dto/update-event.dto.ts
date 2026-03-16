import * as yup from 'yup';

export const updateEventSchema = yup.object({
  title: yup.string().min(2, "Назва занадто коротка").optional(),
  description: yup.string().nullable().optional(),
  startsAt: yup.date().optional(),
  // Allow null for "unlimited" and add validation to ensure endsAt is after startsAt if both are provided
  endsAt: yup.date()
    .nullable()
    .test('is-after-start', 'Дата завершення має бути після початку', function(value) {
      const { startsAt } = this.parent;
      if (!value || !startsAt) return true; // If either is not provided, we skip this validation (handled by optional())
      return value > startsAt;
    })
    .optional(),
  location: yup.string().optional(),
  // Allow null for "unlimited"
  capacity: yup.number()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .integer()
    .min(1, "Мінімум 1 місце")
    .nullable() 
    .optional(),
  visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']).optional(),
  tagIds: yup.array().of(yup.string()).max(5, 'Максимум 5 тегів').optional()
});

export class UpdateEventDto {
  title?: string;
  description?: string;
  startsAt?: Date;
  endsAt?: Date | null; // Added null
  location?: string;
  capacity?: number | null; // Added null
  visibility?: 'PUBLIC' | 'PRIVATE';
  tagIds?: string[];
}