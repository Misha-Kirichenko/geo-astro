import { ServiceEnum } from 'src/common/enums';

interface ValidationRule<T = string> {
  fieldName: string;
  validator: (value: T) => boolean;
  errorMessage: string;
  fieldTip: string;
}

export type TServiceFormValidation = Partial<
  Record<ServiceEnum, ValidationRule[]>
>;
