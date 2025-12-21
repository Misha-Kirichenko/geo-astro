import { LangEnum } from 'src/common/enums';
import { FlagsEnum } from 'src/common/enums';
import { LangEventEnum } from 'src/tg-bot/enums/lang-events.enum';

export const getLangKeyboard = (
  keyBoardType: 'lang_select' | 'lang_change',
) => [
  [
    {
      text: FlagsEnum.GE,
      callback_data: `${LangEventEnum[keyBoardType]}:${LangEnum.GE}`,
    },
    {
      text: FlagsEnum.RU,
      callback_data: `${LangEventEnum[keyBoardType]}:${LangEnum.RU}`,
    },
    {
      text: FlagsEnum.EN,
      callback_data: `${LangEventEnum[keyBoardType]}:${LangEnum.EN}`,
    },
  ],
];
