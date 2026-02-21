import { LangEnum, PaymentTypeEnum } from 'src/common/enums';

export const PAYMENT_TYPE_MENU = {
  [LangEnum.EN]: {
    [PaymentTypeEnum.ONLINE_PAYMENT]: `💳 Online payment`,
    [PaymentTypeEnum.INVOICE]: '🧾Bank transfer / Invoice',
  },
  [LangEnum.RU]: {
    [PaymentTypeEnum.ONLINE_PAYMENT]: `💳 Оплата онлайн`,
    [PaymentTypeEnum.INVOICE]: '🧾 Банковский перевод / Счёт',
  },
  [LangEnum.GE]: {
    [PaymentTypeEnum.ONLINE_PAYMENT]: `💳 ონლაინ გადახდა`,
    [PaymentTypeEnum.INVOICE]: '🧾 საბანკო გადარიცხვა / ინვოისი',
  },
};

export const PAYMENT_TYPE_MENU_HEADING = {
  [LangEnum.EN]: 'Please select a payment type:',
  [LangEnum.RU]: 'Пожалуйста, выберите вариант оплаты:',
  [LangEnum.GE]: 'გთხოვთ, აირჩიეთ გადახდის ტიპი:',
};
