import * as yup from 'yup';

export const updateEventSchema = yup.object({
  title: yup.string().min(2, "Назва занадто коротка").optional(),
  description: yup.string().nullable().optional(),
  startsAt: yup.date().optional(),
  // Дозволяємо null, якщо дата завершення видаляється
  endsAt: yup.date()
    .nullable()
    .test('is-after-start', 'Дата завершення має бути після початку', function(value) {
      const { startsAt } = this.parent;
      if (!value || !startsAt) return true; // Якщо одного з полів немає, пропускаємо
      return value > startsAt;
    })
    .optional(),
  location: yup.string().optional(),
  // Дозволяємо null для "unlimited"
  capacity: yup.number()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .integer()
    .min(1, "Мінімум 1 місце")
    .nullable() 
    .optional(),
  visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']).optional()
});

export class UpdateEventDto {
  title?: string;
  description?: string;
  startsAt?: Date;
  endsAt?: Date | null; // Додано null
  location?: string;
  capacity?: number | null; // Додано null
  visibility?: 'PUBLIC' | 'PRIVATE';
}