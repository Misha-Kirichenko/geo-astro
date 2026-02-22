import {
  LangEventEnum,
  NavigationEventsEnum,
  PaymentStepEnum,
  PromocodeEventEnum,
  ServicesEventEnum,
} from '../enums';

export type TMenuStep =
  | ServicesEventEnum
  | NavigationEventsEnum
  | PromocodeEventEnum
  | LangEventEnum
  | PaymentStepEnum;
