import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'yup';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema?: ObjectSchema<any>) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!this.schema) return value;
    try {
      const validated = await this.schema.validate(value, { abortEarly: false, stripUnknown: true });
      return validated;
    } catch (err: any) {
      throw new BadRequestException(err.errors);
    }
  }
}
