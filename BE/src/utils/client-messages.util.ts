import { LangEnum, ServiceEnum } from 'src/common/enums';
import { ClientMessageSourceEnum } from 'src/tg-bot/enums';
import { IFormData } from 'src/tg-bot/interfaces';
import { TFullFormData, TPartialForms } from 'src/tg-bot/types';

export const clientMessagesUtil = {
  notExists: (source: ClientMessageSourceEnum, lang: LangEnum): string => {
    const sources: Record<ClientMessageSourceEnum, Record<LangEnum, string>> = {
      promocode: {
        [LangEnum.EN]: 'Unfortunately promocode',
        [LangEnum.GE]: 'სამწუხაროდ ასეთი პრომოკოდი',
        [LangEnum.RU]: 'К сожалению такого промокода',
      },
    };

    const keyFrase: Record<LangEnum, string> = {
      [LangEnum.EN]: `doesn't exist...😢`,
      [LangEnum.GE]: 'არ არსებობს...😢',
      [LangEnum.RU]: 'не существует...😢',
    };

    const message = `${sources[source][lang]} ${keyFrase[lang]}`;
    return message;
  },
  expired: (source: ClientMessageSourceEnum, lang: LangEnum): string => {
    const sources: Record<ClientMessageSourceEnum, Record<LangEnum, string>> = {
      promocode: {
        [LangEnum.EN]: 'Unfortunately promocode',
        [LangEnum.GE]: 'სამწუხაროდ პრომოკოდს',
        [LangEnum.RU]: 'К сожалению промокод',
      },
    };

    const keyFrase: Record<LangEnum, string> = {
      [LangEnum.EN]: `is expired...😢🕦`,
      [LangEnum.GE]: 'ვადა გაუვიდა...😢🕦',
      [LangEnum.RU]: 'просрочен...😢🕦',
    };

    const message = `${sources[source][lang]} ${keyFrase[lang]}`;
    return message;
  },
  promoApplied: (lang: LangEnum): string => {
    const frase: Record<LangEnum, string> = {
      [LangEnum.EN]: `Promocode was successfully applied! 🥳🎉`,
      [LangEnum.GE]: 'პრომოკოდი წარმატებით ამოქმედდა! 🥳🎉',
      [LangEnum.RU]: 'Промокод был успешно применён! 🥳🎉',
    };

    const message = frase[lang];
    return message;
  },

  serviceFormValidationError: (lang: LangEnum): string => {
    const frase: Record<LangEnum, string> = {
      [LangEnum.EN]: `Promocode was successfully applied! 🥳🎉`,
      [LangEnum.GE]: 'პრომოკოდი წარმატებით ამოქმედდა! 🥳🎉',
      [LangEnum.RU]: 'Промокод был успешно применён! 🥳🎉',
    };

    const message = frase[lang];
    return message;
  },

  getCachedFormDataMessage: (
    service: ServiceEnum,
    lang: LangEnum,
    formData: TPartialForms,
  ) => {
    // const frase: Record<LangEnum, string> = {
    //   [LangEnum.EN]: `Your form data at this moment`,
    //   [LangEnum.GE]: 'თქვენი ანკეტა',
    //   [LangEnum.RU]: 'Ваша анкета сейчас',
    // };

    // const translations = {
    //   fullName: {
    //     [LangEnum.EN]: 'Full name',
    //     [LangEnum.RU]: 'Имя',
    //     [LangEnum.GE]: 'სახელი',
    //   },
    //   birthDate: {
    //     [LangEnum.EN]: 'Birth Date',
    //     [LangEnum.RU]: 'День рождения',
    //     [LangEnum.GE]: 'დაბადების თარიღი',
    //   },
    //   birthTime: {
    //     [LangEnum.EN]: 'Birth Time',
    //     [LangEnum.RU]: 'Время рождения',
    //     [LangEnum.GE]: 'დაბადების დრო',
    //   },
    // };

    // const data = Object.entries(formData.form1)
    //   .map((el) => {
    //     const [field, fieldValue] = el;
    //     const fieldName = translations[field][lang];

    //     const msg = `${fieldName}: ${fieldValue}`;
    //     return msg;
    //   })
    //   .join('\n');
  },
};
