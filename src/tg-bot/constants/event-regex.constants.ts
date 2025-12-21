import { LangEnum, ServiceEnum } from 'src/common/enums';
import {
  LangEventEnum,
  NavigationEventsEnum,
  ServicesEventEnum,
} from '../enums';

export const EVENT_REGEX = {
  lang_select: new RegExp(
    `^${LangEventEnum.lang_select}:(${Object.values(LangEnum).join('|')})`,
    'i',
  ),
  lang_menu: new RegExp(
    `^${LangEventEnum.lang_menu}:(${Object.values(LangEnum).join('|')})`,
    'i',
  ),
  lang_change: new RegExp(
    `^${LangEventEnum.lang_change}:(${Object.values(LangEnum).join('|')})`,
    'i',
  ),
  main_menu: new RegExp(
    `^${NavigationEventsEnum.main_menu}:(${Object.values(LangEnum).join('|')})`,
    'i',
  ),
  service_select: new RegExp(
    `^${ServicesEventEnum.service_select}:(${Object.values(LangEnum).join('|')}):(${Object.values(ServiceEnum).join('|')})`,
    'i',
  ),
  service_menu: new RegExp(
    `^${ServicesEventEnum.service_menu}:(${Object.values(LangEnum).join('|')})`,
    'i',
  ),
  promocode: new RegExp('^/promo/([a-z0-9_-]{9,10})$', 'i'),
  service_form: new RegExp(
    `^${ServicesEventEnum.service_form}:(${Object.values(LangEnum).join('|')}):(${Object.values(ServiceEnum).join('|')}):([0-9]{1,2})$`,
  ),
};
