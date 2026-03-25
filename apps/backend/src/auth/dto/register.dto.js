"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = exports.registerSchema = void 0;
const yup = require("yup");
exports.registerSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    name: yup.string().required()
});
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
//# sourceMappingURL=register.dto.js.map