import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import {
  CHANGE_LANG_MESSAGE,
  GREETING_MESSAGE,
  LANG_CHANGE_SUCCESS_MESSAGE,
  SERVICE_LIST_HEADING,
} from './constants';
import { LangEnum } from 'src/common/enums';
import { UserService } from 'src/user/user.service';
import { getLangKeyboard } from 'src/utils';
import { TShowMainMenuCallback } from './types';
import { getServicesKeyboard } from 'src/utils/get-services-keyboard';
import { NavigationEventsEnum } from './enums';

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

  private async saveUserWithLang(ctx: Context, lang: LangEnum): Promise<void> {
    if (!ctx.callbackQuery?.from) throw new Error('No ctx.from in callback');
    const { id, first_name, last_name, username } =
      ctx.callbackQuery.from || {};
    const userObj = {
      tgId: id,
      firstName: first_name,
      ...(last_name ? { lastName: last_name } : {}),
      ...(username ? { userName: username } : {}),
      lang,
    };

    await this.userService.saveUser(
      userObj,
      ctx.callbackQuery.from.language_code as LangEnum,
    );
  }

  public async langSelect(
    ctx: Context,
    showMainMenuCallback: TShowMainMenuCallback,
  ): Promise<void> {
    const { callbackQuery } = ctx;
    if (callbackQuery && 'data' in callbackQuery && callbackQuery.data) {
      const [, , lang] = callbackQuery.data.split(':');
      await this.saveUserWithLang(ctx, lang as LangEnum);
      ctx.session['lang'] = lang as LangEnum;
      await ctx.answerCbQuery();
      await showMainMenuCallback(ctx);
      return;
    }
    throw new Error();
  }

  public async getLangMenu(ctx: Context): Promise<void> {
    const userLang = ctx.session.lang || ctx.from?.language_code || LangEnum.EN;
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
    let selectedLang =
      ctx.session.lang || (from?.language_code as LangEnum) || LangEnum.EN;
    if (callbackQuery && 'data' in callbackQuery && callbackQuery.data) {
      selectedLang = callbackQuery.data.split(':')[2] as LangEnum;
      await this.saveUserWithLang(ctx, selectedLang);
      ctx.session['lang'] = selectedLang;
      const successMessage = LANG_CHANGE_SUCCESS_MESSAGE[selectedLang];
      await ctx.reply(successMessage);
      await showMainMenuCallback(ctx);
      await ctx.answerCbQuery();
      return;
    }
    throw new Error();
  }

  public async showServicesMenu(ctx: Context): Promise<void> {
    if (!ctx.from) throw new Error('No from in context');
    const user = await this.userService.findByTgId(ctx.from.id);
    if (!user) throw new Error('User not found');
    const { lang } = user;
    const servicesKeyboardItems = getServicesKeyboard(lang as LangEnum);
    const servicesKeyboard = {
      reply_markup: {
        inline_keyboard: [
          ...servicesKeyboardItems,
          [{ text: '⬅️', callback_data: NavigationEventsEnum.main_menu }],
        ],
      },
    };

    const serviceMenuHeading =
      SERVICE_LIST_HEADING[lang as keyof typeof SERVICE_LIST_HEADING];
    await ctx.reply(serviceMenuHeading, servicesKeyboard);
    await ctx.answerCbQuery();
  }
}
