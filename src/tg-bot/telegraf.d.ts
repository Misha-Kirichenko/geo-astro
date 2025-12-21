import { LangEnum, ServiceEnum } from 'src/common/enums';
import 'telegraf';
import {
  LangEventEnum,
  NavigationEventsEnum,
  PromocodeEventEnum,
  ServicesEventEnum,
} from './enums';

type TServiceFormData = Partial<Record<ServiceFormFieldsEnum, string>>;

declare module 'telegraf' {
  interface Context {
    session: {
      lang?: LangEnum;
      step?:
        | ServicesEventEnum
        | NavigationEventsEnum
        | PromocodeEventEnum
        | LangEventEnum;
      serviceItem?: {
        promocode?: string;
        stage?: number;
        serviceSlug?: ServiceEnum;
        form1?: TServiceFormData;
        form2?: TServiceFormData;
      };
    };
  }
}
