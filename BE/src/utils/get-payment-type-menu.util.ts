import { LangEnum, PaymentTypeEnum } from 'src/common/enums';
import { PAYMENT_TYPE_MENU } from 'src/tg-bot/constants';
import { PaymentEventEnum } from 'src/tg-bot/enums';
import { TInlineMenuItem } from 'src/tg-bot/types';

export const getPaymentTypeMenu = (lang: LangEnum): TInlineMenuItem[] => {
  const menu = PAYMENT_TYPE_MENU[lang];

  const menuItemsArray: TInlineMenuItem[] = [];

  for (const paymentType in menu) {
    const paymentTypeText = menu[paymentType as PaymentTypeEnum];
    const menuItem: TInlineMenuItem = [
      {
        text: paymentTypeText,
        callback_data: `${PaymentEventEnum.select_type}:${paymentType}`,
      },
    ];

    menuItemsArray.push(menuItem);
  }

  return menuItemsArray;
};
