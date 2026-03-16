import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'yup';
export declare class ValidationPipe implements PipeTransform {
    private schema?;
    constructor(schema?: ObjectSchema<any> | undefined);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}
