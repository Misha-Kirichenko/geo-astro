import { LangEnum } from 'src/common/enums';
import 'telegraf';

declare module 'telegraf' {
  interface Context {
    session: { lang?: LangEnum };
  }
}
