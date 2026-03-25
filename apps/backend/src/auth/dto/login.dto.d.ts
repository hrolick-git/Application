import * as yup from 'yup';
export declare const loginSchema: yup.ObjectSchema<{
    email: string;
    password: string;
}, yup.AnyObject, {
    email: undefined;
    password: undefined;
}, "">;
export declare class LoginDto {
    email: string;
    password: string;
}
