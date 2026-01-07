import { LangEnum, ServiceEnum } from 'src/common/enums';
import { RegExpContext } from 'src/common/interfaces';
import { NAV_MENU } from 'src/tg-bot/constants';
import { ServicesEventEnum } from 'src/tg-bot/enums';
import { TPartialForms } from 'src/tg-bot/types';
import { SERVICE_FORM_VALIDATION } from 'src/tg-bot/validation/service-form.validation';
import { Markup } from 'telegraf';

export const getNavMenu = (ctx: RegExpContext, formData: TPartialForms) => {
  const { lang, step, serviceItem } = ctx.session;
  const navMenu = [
    [
      NAV_MENU.main_menu[lang as LangEnum],
      NAV_MENU.services_button[lang as LangEnum],
    ],
  ];
  const formFillStarted = formData.form1
    ? Boolean(Object.keys(formData.form1).length)
    : false;
  if (step && step === ServicesEventEnum.service_form && formFillStarted) {
    navMenu.unshift([NAV_MENU.retry_button[lang as LangEnum]]);
  }
  const serviceFormValidationStages = SERVICE_FORM_VALIDATION(lang as LangEnum);
  const serviceFormValidationStagesTotal =
    serviceFormValidationStages[serviceItem as ServiceEnum]?.length;
  if (formData.stage === serviceFormValidationStagesTotal) {
    navMenu[0].unshift(NAV_MENU.go_to_payment[lang as LangEnum]);
  }
  const navMenuKeyboard = Markup.keyboard(navMenu).resize().oneTime();
  return navMenuKeyboard;
};
