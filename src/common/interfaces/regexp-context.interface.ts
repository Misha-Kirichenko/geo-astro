import { Context as TelegrafContext } from 'telegraf';

export interface RegExpContext extends TelegrafContext {
  match: RegExpMatchArray;
}
