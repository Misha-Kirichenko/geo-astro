import {
  LangEventEnum,
  NavigationEventsEnum,
  PromocodeEventEnum,
  ServicesEventEnum,
} from '../enums';

export type TMenuStep =
  | ServicesEventEnum
  | NavigationEventsEnum
  | PromocodeEventEnum
  | LangEventEnum;
