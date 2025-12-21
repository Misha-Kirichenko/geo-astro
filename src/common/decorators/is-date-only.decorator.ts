import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { REGEXES } from 'src/common/constants/regexes.constants';

export function IsDateOnly(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateOnly',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args?: ValidationArguments) {
          if (typeof value !== 'string') return false;
          if (!REGEXES.IS_DATE_STRING.test(value)) return false;

          const date = new Date(value);
          return (
            !isNaN(date.getTime()) &&
            value === date.toISOString().substring(0, 10)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date in YYYY-MM-DD format`;
        },
      },
    });
  };
}
