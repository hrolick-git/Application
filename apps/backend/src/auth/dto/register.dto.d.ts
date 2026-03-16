import * as yup from 'yup';
export declare const registerSchema: yup.ObjectSchema<{
    email: string;
    password: string;
    name: string;
}, yup.AnyObject, {
    email: undefined;
    password: undefined;
    name: undefined;
}, "">;
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
}
