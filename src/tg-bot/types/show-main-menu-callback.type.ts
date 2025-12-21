import { LangEnum } from 'src/common/enums';
import { Context } from 'telegraf';

export type TShowMainMenuCallback = (
  ctx: Context,
  lang: LangEnum,
) => Promise<void>;
