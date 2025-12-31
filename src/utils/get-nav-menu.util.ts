import { LangEnum, ServiceEnum } from 'src/common/enums';
import { RegExpContext } from 'src/common/interfaces';
import { NAV_MENU } from 'src/tg-bot/constants';
import { ServicesEventEnum } from 'src/tg-bot/enums';
import { SERVICE_FORM_VALIDATION } from 'src/tg-bot/validation/service-form.validation';
import { Markup } from 'telegraf';

export const getNavMenu = (ctx: RegExpContext) => {
  const { lang, step, serviceItem } = ctx.session;

  const navMenu = [
    [
      NAV_MENU.main_menu[lang as LangEnum],
      NAV_MENU.services_button[lang as LangEnum],
    ],
  ];

  const formFillStarted = ctx?.session?.serviceItem?.form1
    ? Boolean(Object.keys(ctx?.session?.serviceItem?.form1).length)
    : false;

  if (step && step === ServicesEventEnum.service_form && formFillStarted) {
    navMenu.unshift([NAV_MENU.retry_button[lang as LangEnum]]);
  }

  const serviceFormValidationStages = SERVICE_FORM_VALIDATION(lang as LangEnum);
  const serviceFormValidationStagesTotal =
    serviceFormValidationStages[serviceItem?.serviceSlug as ServiceEnum]
      ?.length;

  if (serviceItem?.stage === serviceFormValidationStagesTotal) {
    navMenu[0].unshift(NAV_MENU.go_to_payment[lang as LangEnum]);
  }

  const navMenuKeyboard = Markup.keyboard(navMenu).resize().oneTime();
  return navMenuKeyboard;
};
