import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import {
  CHANGE_LANG_MESSAGE,
  GREETING_MESSAGE,
  LANG_CHANGE_SUCCESS_MESSAGE,
} from './constants';
import { LangEnum } from 'src/common/enums';
import { UserService } from 'src/user/user.service';
import { getLangKeyboard } from 'src/utils';
import { TShowMainMenuCallback } from './types';

@Injectable()
export class TgBotLocalizationService {
  constructor(private readonly userService: UserService) { }

  public async handleFirstGreeting(ctx: Context): Promise<void> {
    let selectedLang = LangEnum.EN;
    const langList = Object.values(LangEnum);
    const userLang = ctx.from?.language_code;
    if (userLang && langList.includes(userLang as LangEnum)) {
      selectedLang = userLang as LangEnum;
    }
    const greetingMessage =
      GREETING_MESSAGE[selectedLang as keyof typeof GREETING_MESSAGE];

    const langSelectKeyboard = getLangKeyboard('lang_select');

    await ctx.reply(greetingMessage, {
      reply_markup: {
        inline_keyboard: langSelectKeyboard,
      },
    });
  }

  public async langSelect(
    ctx: Context,
    showMainMenuCallback: TShowMainMenuCallback,
  ): Promise<void> {
    const { callbackQuery } = ctx;
    if (callbackQuery && 'data' in callbackQuery && callbackQuery.data) {
      const [, , lang] = callbackQuery.data.split(':');
      const { id, first_name, last_name, username } = ctx.from || {};
      const userObj = {
        tgId: id,
        firstName: first_name,
        ...(last_name ? { lastName: last_name } : {}),
        ...(username ? { userName: username } : {}),
        lang,
      };

      await this.userService.saveUser(userObj);
      await ctx.answerCbQuery();
      await showMainMenuCallback(ctx, lang as LangEnum);
      return;
    }
    throw new Error();
  }

  public async geLangMenu(ctx: Context): Promise<void> {
    const foundUser = await this.userService.findByTgId(ctx.from?.id as number);
    const userLang = foundUser?.lang || ctx.from?.language_code || LangEnum.EN;
    const headingMessage =
      CHANGE_LANG_MESSAGE[userLang as keyof typeof CHANGE_LANG_MESSAGE];

    await ctx.answerCbQuery();
    const langChangeKeyboard = getLangKeyboard('lang_change');

    await ctx.reply(headingMessage, {
      reply_markup: {
        inline_keyboard: langChangeKeyboard,
      },
    });
  }

  public async langChange(
    ctx: Context,
    showMainMenuCallback: TShowMainMenuCallback,
  ): Promise<void> {
    const { from, callbackQuery } = ctx;
    let selectedLang = (ctx.from?.language_code as LangEnum) || LangEnum.EN;
    if (callbackQuery && 'data' in callbackQuery && callbackQuery.data) {
      selectedLang = callbackQuery.data.split(':')[2] as LangEnum;
      await this.userService.changeUsersLang(from?.id as number, selectedLang);
      const successMessage = LANG_CHANGE_SUCCESS_MESSAGE[selectedLang];
      await ctx.reply(successMessage);
      await showMainMenuCallback(ctx, selectedLang);
      return;
    }
    throw new Error();
  }
}
