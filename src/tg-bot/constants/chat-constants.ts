import { LangEnum } from 'src/common/enums';
import { LangEventEnum } from '../enums/lang-events.enum';

export const CHANGE_LANG_MESSAGE = {
  en: `Select your preferred language:`,
  ru: `Выберите предпочитаемый язык:`,
  ge: 'აირჩიეთ სასურველი ენა:',
};

export const GREETING_MESSAGE = {
  en: `Welcome to the Geo Astro Bot! 🌍✨.\nChoose your language to get started.`,
  ru: `Добро пожаловать в Geo Astro Bot! 🌍✨.\nДля старта выберите нужный язык`,
};

export const LANG_SELECT_ERROR_MESSAGE = {
  en: `An error occurred while selecting the language 😢... Please try again later 🔁`,
  ru: `Произошла ошибка при выборе языка 😢 .... Пожалуйста, попробуйте чуть позже еще раз 🔁`,
};

export const EXISTING_USER_ACTIONS_HEADING = {
  en: `🏠 Main Menu`,
  ru: `🏠 Главное меню`,
  ge: '🏠 მთავარი მენიუ',
};

export const EXISTING_USER_ACTIONS = {
  [LangEnum.EN]: [
    [
      {
        text: 'Change language',
        callback_data: LangEventEnum.lang_menu,
      },
      {
        text: 'View subscription',
        callback_data: `subscription:view`,
      },
    ],
    [
      {
        text: 'Packages',
        callback_data: `packages:view`,
      },
      {
        text: 'Services',
        callback_data: `services:view`,
      },
    ],
  ],
  [LangEnum.GE]: [
    [
      {
        text: 'ენის შეცვლა',
        callback_data: LangEventEnum.lang_menu,
      },
      {
        text: 'გამოწერების ნახვა',
        callback_data: `subscription:view`,
      },
    ],
    [
      {
        text: 'პაკეტები',
        callback_data: `packages:view`,
      },
      {
        text: 'მომსახურეობები',
        callback_data: `services:view`,
      },
    ],
  ],
  [LangEnum.RU]: [
    [
      {
        text: 'Сменить язык',
        callback_data: LangEventEnum.lang_menu,
      },
      {
        text: 'Смотреть подписку',
        callback_data: `subscription:view`,
      },
    ],
    [
      {
        text: 'Пакеты',
        callback_data: `packages:view`,
      },
      {
        text: 'Услуги',
        callback_data: `services:view`,
      },
    ],
  ],
};

export const LANG_CHANGE_SUCCESS_MESSAGE = {
  en: `Language changed successfully! 🎉`,
  ru: `Язык успешно изменен! 🎉`,
  ge: 'ენა წარმატებით შეიცვალა! 🎉',
};
