import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required()
});

export class RegisterDto {
  email!: string;
  password!: string;
}
