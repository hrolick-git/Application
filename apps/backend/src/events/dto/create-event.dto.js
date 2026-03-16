"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventDto = exports.createEventSchema = void 0;
const yup = require("yup");
exports.createEventSchema = yup.object({
    title: yup.string().required("Назва обов'язкова"),
    description: yup.string().optional(),
    startsAt: yup.date().required("Дата початку обов'язкова"),
    endsAt: yup.date().nullable().optional(),
    location: yup.string().required("Локація обов'язкова"),
    capacity: yup.number().integer().nullable().optional(),
    visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']).default('PUBLIC')
});
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;
//# sourceMappingURL=create-event.dto.js.map