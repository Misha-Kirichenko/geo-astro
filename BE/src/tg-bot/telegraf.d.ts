import { LangEnum, ServiceEnum } from 'src/common/enums';
import 'telegraf';
import { TMenuStep } from './types';
import { ServiceFormFieldsEnum } from './enums';

type TServiceFormData = Partial<Record<ServiceFormFieldsEnum, string>>;

declare module 'telegraf' {
  interface Context {
    session: {
      lang?: LangEnum;
      step?: TMenuStep;
      serviceItem?: ServiceEnum;
    };
  }
}
