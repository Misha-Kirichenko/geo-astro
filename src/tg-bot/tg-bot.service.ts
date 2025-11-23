import { Injectable } from '@nestjs/common';
import { Action, Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import {
  CHANGE_LANG_MESSAGE,
  EXISTING_USER_ACTIONS,
  EXISTING_USER_ACTIONS_HEADING,
  GREETING_MESSAGE,
  LANG_SELECT,
  LANG_SELECT_ERROR_MESSAGE,
} from './constants';
import { LangEnum } from 'src/common/enums';
import { UserService } from 'src/user/user.service';
import { LangEventEnum } from './enums/lang-events.enum';

@Update()
export class TgBotService {
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
    await ctx.reply(greetingMessage, {
      reply_markup: {
        inline_keyboard: LANG_SELECT,
      },
    });
  }

  public async showMainMenu(ctx: Context, lang: LangEnum): Promise<void> {
    const existingUserActions = EXISTING_USER_ACTIONS[lang];
    const existingUserHeading = EXISTING_USER_ACTIONS_HEADING[lang];
    await ctx.reply(existingUserHeading, {
      reply_markup: {
        inline_keyboard: existingUserActions,
      },
    });
  }

  @Start()
  async startCommand(@Ctx() ctx: Context): Promise<void> {
    const foundUser = await this.userService.findByTgId(ctx.from?.id as number);
    if (!foundUser) await this.handleFirstGreeting(ctx);
    else await this.showMainMenu(ctx, foundUser.lang);
  }

  @Action(new RegExp(`^${LangEventEnum.lang_select}:`))
  async onLangSelect(@Ctx() ctx: Context): Promise<void> {
    try {
      const { callbackQuery } = ctx;
      if (callbackQuery && 'data' in callbackQuery) {
        if (callbackQuery.data) {
          await ctx.answerCbQuery();
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
          await this.showMainMenu(ctx, lang as LangEnum);
        }
      }
    } catch (e) {
      const errorMessage =
        LANG_SELECT_ERROR_MESSAGE[
        ctx.from?.language_code as keyof typeof LANG_SELECT_ERROR_MESSAGE
        ];

      console.error('Language selection error:', e);
      await ctx.reply(errorMessage);
    }
  }

  @Action(new RegExp(`^${LangEventEnum.lang_change}`))
  async onLangChange(@Ctx() ctx: Context): Promise<void> {
    const foundUser = await this.userService.findByTgId(ctx.from?.id as number);
    const userLang = foundUser?.lang || ctx.from?.language_code || LangEnum.EN;
    const headingMessage =
      CHANGE_LANG_MESSAGE[userLang as keyof typeof CHANGE_LANG_MESSAGE];
    await ctx.answerCbQuery();
    await ctx.reply(headingMessage, {
      reply_markup: {
        inline_keyboard: LANG_SELECT,
      },
    });
  }
}
