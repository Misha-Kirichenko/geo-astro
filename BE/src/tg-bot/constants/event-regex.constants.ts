import { LangEnum, ServiceEnum } from 'src/common/enums';
import {
  LangEventEnum,
  NavigationEventsEnum,
  ServicesEventEnum,
} from '../enums';
import { NAV_MENU } from './chat-menu-constants';
import { REGEXES } from 'src/common/constants';

export const EVENT_REGEX = {
  fill_form_from_scratch: new RegExp(
    `^(${Object.values(NAV_MENU.retry_button).join('|')})$`,
    'iu',
  ),
  view_form: new RegExp(
    `^(${Object.values(NAV_MENU.form_preview).join('|')})$`,
    'iu',
  ),
  lang_select: new RegExp(
    `^${LangEventEnum.lang_select}:(${Object.values(LangEnum).join('|')})`,
    'iu',
  ),
  lang_menu: new RegExp(`^${LangEventEnum.lang_menu}`),
  lang_change: new RegExp(
    `^${LangEventEnum.lang_change}:(${Object.values(LangEnum).join('|')})`,
    'iu',
  ),
  main_menu: new RegExp(`^${NavigationEventsEnum.main_menu}$`),
  main_menu_nav: new RegExp(
    `^(${Object.values(NAV_MENU.main_menu).join('|')})$`,
    'iu',
  ),
  services_menu_nav: new RegExp(
    `^(${Object.values(NAV_MENU.services_button).join('|')})$`,
    'iu',
  ),
  prev_stage_nav: new RegExp(
    `^(${Object.values(NAV_MENU.prev_step).join('|')})$`,
  ),
  service_select: new RegExp(
    `^${ServicesEventEnum.service_select}:(${Object.values(ServiceEnum).join('|')})`,
    'iu',
  ),
  service_menu: new RegExp(`^${ServicesEventEnum.service_menu}`),
  promocode: new RegExp('^/promo/([a-z0-9_-]{9,10})$', 'i'),
  service_form: new RegExp(
    `^${ServicesEventEnum.service_form}:(${Object.values(ServiceEnum).join('|')}):(0)$`,
    'iu',
  ),
  service_form_continue: new RegExp(
    `^${ServicesEventEnum.service_form_fill_continue}:(${Object.values(ServiceEnum).join('|')}):([0-9]{1,2})$`,
    'i',
  ),
  form_data_input: new RegExp(
    Object.values(REGEXES.FORM_DATA_REGEXES)
      .map((r) => r.source)
      .join('|'),
    'iu',
  ),
  go_to_payments_menu: new RegExp(
    `^(${Object.values(NAV_MENU.go_to_payment).join('|')})$`,
    'iu',
  ),
};
