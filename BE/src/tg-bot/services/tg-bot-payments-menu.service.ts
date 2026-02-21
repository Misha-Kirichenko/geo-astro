import { Injectable } from '@nestjs/common';
import { LangEnum } from 'src/common/enums';
import { getPaymentTypeMenu } from 'src/utils/get-payment-type-menu.util';
import { PAYMENT_TYPE_MENU_HEADING } from '../constants';
import { RegExpContext } from 'src/common/interfaces';

@Injectable()
export class TgBotPaymentsMenuService {
  public async handleGoToPaymentsMenu(ctx: RegExpContext): Promise<void> {
    const selectedLang = (ctx.session.lang ||
      ctx.from?.language_code ||
      LangEnum.EN) as LangEnum;
    const paymentTypeMenu = getPaymentTypeMenu(selectedLang);
    const paymentMenuHeading = PAYMENT_TYPE_MENU_HEADING[selectedLang];

    const paymentTypeMenuKeyboard = {
      reply_markup: {
        inline_keyboard: paymentTypeMenu,
      },
    };

    await ctx.reply(paymentMenuHeading, paymentTypeMenuKeyboard);
  }
}
