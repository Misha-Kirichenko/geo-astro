import { IFormData } from '../interfaces/form-data.interface';
import { TFullFormData } from './full-form.type';

export type TPartialForms = {
  form1: Partial<IFormData>;
  form2: Partial<IFormData>;
} & Pick<TFullFormData, 'createdAt' | 'updatedAt' | 'stage'>;
