"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = exports.loginSchema = void 0;
const yup = require("yup");
exports.loginSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
});
class LoginDto {
}
exports.LoginDto = LoginDto;
//# sourceMappingURL=login.dto.js.map