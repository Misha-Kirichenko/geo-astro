import { LangEventEnum } from '../enums/lang-events.enum';
import { ServicesEventEnum } from '../enums';
import { LangEnum } from 'src/common/enums';

export const CHANGE_LANG_MESSAGE = {
  [LangEnum.EN]: `Select your preferred language:`,
  [LangEnum.RU]: `Выберите предпочитаемый язык:`,
  [LangEnum.GE]: 'აირჩიეთ სასურველი ენა:',
};

export const GREETING_MESSAGE = {
  [LangEnum.EN]: `Welcome to the Geo Astro Bot! 🌍✨.\nChoose your language to get started.`,
  [LangEnum.RU]: `Добро пожаловать в Geo Astro Bot! 🌍✨.\nДля старта выберите нужный язык`,
};

export const LANG_SELECT_ERROR_MESSAGE = {
  [LangEnum.EN]: `An error occurred while selecting the language 😢... Please try again later 🔁`,
  [LangEnum.RU]: `Произошла ошибка при выборе языка 😢 .... Пожалуйста, попробуйте чуть позже еще раз 🔁`,
};

export const EXISTING_USER_ACTIONS_HEADING = {
  [LangEnum.EN]: `🏠 Main Menu`,
  [LangEnum.RU]: `🏠 Главное меню`,
  [LangEnum.GE]: '🏠 მთავარი მენიუ',
};

export const EXISTING_USER_ACTIONS = {
  [LangEnum.EN]: [
    [
      {
        text: '🌍 Change language',
        callback_data: LangEventEnum.lang_menu,
      },
      {
        text: '👀 View subscription',
        callback_data: `subscription: view`,
      },
    ],
    [
      {
        text: '🛍 Packages',
        callback_data: `packages: view`,
      },
      {
        text: '🛎 Services',
        callback_data: ServicesEventEnum.service_menu,
      },
    ],
  ],
  [LangEnum.GE]: [
    [
      {
        text: '🌍 ენის შეცვლა',
        callback_data: LangEventEnum.lang_menu,
      },
      {
        text: '👀 გამოწერების ნახვა',
        callback_data: `subscription: view`,
      },
    ],
    [
      {
        text: '🛍 პაკეტები',
        callback_data: `packages: view`,
      },
      {
        text: '🛎 სერვისები',
        callback_data: ServicesEventEnum.service_menu,
      },
    ],
  ],
  [LangEnum.RU]: [
    [
      {
        text: '🌍 Сменить язык',
        callback_data: LangEventEnum.lang_menu,
      },
      {
        text: '👀 Смотреть подписку',
        callback_data: `subscription: view`,
      },
    ],
    [
      {
        text: '🛍 Пакеты',
        callback_data: `packages: view`,
      },
      {
        text: '🛎 Услуги',
        callback_data: ServicesEventEnum.service_menu,
      },
    ],
  ],
};

export const LANG_CHANGE_SUCCESS_MESSAGE = {
  [LangEnum.EN]: `Language changed successfully! 🎉`,
  [LangEnum.RU]: `Язык успешно изменен! 🎉`,
  [LangEnum.GE]: 'ენა წარმატებით შეიცვალა! 🎉',
};

export const NON_SUPPORTED_LANG_MESSAGE = {
  [LangEnum.EN]: `Sorry, your language is not supported yet...Please select a different language.`,
  [LangEnum.RU]: `Извините, ваш язык пока не поддерживается...Пожалуйста, выберите другой язык.`,
  [LangEnum.GE]:
    'თქვენი ენის მხარდაჭერა ჯერ-ჯერობით არ გვაქვს... გთხოვთ, აირჩიოთ სხვა ენა.',
};

export const SERVICE_LIST_HEADING = {
  [LangEnum.EN]: `🛎️ Services Menu`,
  [LangEnum.RU]: `🛎️ Меню услуг`,
  [LangEnum.GE]: '🛎️ სერვისები',
};

export const SERVICE_PRICES = {
  [LangEnum.EN]: '💰 Price',
  [LangEnum.RU]: '💰 Цена',
  [LangEnum.GE]: '💰 ფასი',
};

export const BUY = {
  [LangEnum.EN]: '🛒 Buy',
  [LangEnum.RU]: '🛒 Приобрести',
  [LangEnum.GE]: '🛒 შეძენა',
};

export const FILL_FORM_MENU_TIP = {
  [LangEnum.EN]: '📝 Fill the form',
  [LangEnum.RU]: '📝 Заполнить анкету',
  [LangEnum.GE]: '📝 ანკეტის შევსება',
};

export const FILL_FORM_FROM_SCRATCH = {
  [LangEnum.EN]: '📝🔄 Fill the form from scratch',
  [LangEnum.RU]: '📝🔄 Заполнить анкету заново',
  [LangEnum.GE]: '📝🔄 ანკეტის თავიდან შევსება',
};

export const CONTINUE_FORM_FILL = {
  [LangEnum.EN]: '📝➡️ Continue',
  [LangEnum.RU]: '📝➡️ Продолжить',
  [LangEnum.GE]: '📝➡️ გაგრძლება',
};

export const NAV_MENU = {
  main_menu: {
    [LangEnum.EN]: '🏠 Main Menu',
    [LangEnum.RU]: '🏠 Главное меню',
    [LangEnum.GE]: '🏠 მთავარი მენიუ',
  },
  prev_step: {
    [LangEnum.EN]: '⬅️ Previous step',
    [LangEnum.RU]: '⬅️ Предыдущий шаг',
    [LangEnum.GE]: '⬅️ წინა ბიჯი',
  },
  services_button: {
    [LangEnum.EN]: SERVICE_LIST_HEADING[LangEnum.EN],
    [LangEnum.RU]: SERVICE_LIST_HEADING[LangEnum.RU],
    [LangEnum.GE]: SERVICE_LIST_HEADING[LangEnum.GE],
  },
  retry_button: {
    [LangEnum.EN]: '🔄 Fill from scratch',
    [LangEnum.RU]: '🔄 Заполнить заново',
    [LangEnum.GE]: '🔄 თავიდან შევსება',
  },
  go_to_payment: {
    [LangEnum.EN]: '💳 Go to payment',
    [LangEnum.RU]: '💳 Перейти к оплате',
    [LangEnum.GE]: '💳 გადახდაზე გადასვლა',
  },
  form_preview: {
    [LangEnum.EN]: '📋 View form',
    [LangEnum.RU]: '📋 Посмотреть анкету',
    [LangEnum.GE]: '📋 ანკეტის ნახვა',
  },
};

export const CHOOSE_ACTION = {
  [LangEnum.EN]:
    '🆗 Service form is succesfully filled. Please choose the action',
  [LangEnum.RU]:
    '🆗 Анкета услуги успешно заполнена. Пожалуйста, выберите действие',
  [LangEnum.GE]: '🆗 სერვისის ანკეტა წარმატებით შეივსო. გთხოვთ აირჩიოთ ქმედება',
};

export const CACHED_PROMO_APPLIED = {
  [LangEnum.EN]: '💥 Current service has a promo applied',
  [LangEnum.RU]: '💥 На текущую услугу применён промокод',
  [LangEnum.GE]: '💥 მიმდინარე სერვისზე გამოყენებულია პრომოკოდი',
};

export const BACK = {
  [LangEnum.EN]: '⬅️ Back',
  [LangEnum.RU]: '⬅️ Назад',
  [LangEnum.GE]: '⬅️ უკან',
};

export const DESCRIPTION = {
  [LangEnum.EN]: '📜 Description',
  [LangEnum.RU]: '📜 Описание',
  [LangEnum.GE]: '📜 აღწერა',
};
