import { LangEnum } from 'src/common/enums';
import { ClientMessageSourceEnum } from 'src/tg-bot/enums';

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
};
