"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventDto = exports.updateEventSchema = void 0;
const yup = require("yup");
exports.updateEventSchema = yup.object({
    title: yup.string().min(2, "Назва занадто коротка").optional(),
    description: yup.string().nullable().optional(),
    startsAt: yup.date().optional(),
    endsAt: yup.date()
        .nullable()
        .test('is-after-start', 'Дата завершення має бути після початку', function (value) {
        const { startsAt } = this.parent;
        if (!value || !startsAt)
            return true;
        return value > startsAt;
    })
        .optional(),
    location: yup.string().optional(),
    capacity: yup.number()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .integer()
        .min(1, "Мінімум 1 місце")
        .nullable()
        .optional(),
    visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']).optional()
});
class UpdateEventDto {
}
exports.UpdateEventDto = UpdateEventDto;
//# sourceMappingURL=update-event.dto.js.map