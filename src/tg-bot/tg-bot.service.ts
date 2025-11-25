import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import {
  EXISTING_USER_ACTIONS,
  EXISTING_USER_ACTIONS_HEADING,
  LANG_SELECT_ERROR_MESSAGE,
} from './constants';
import { LangEnum } from 'src/common/enums';
import { UserService } from 'src/user/user.service';
import {
  LangEventEnum,
  NavigationEventsEnum,
  ServicesEventEnum,
} from './enums';
import { TgBotLocalizationService } from './tg-bot-localization.service';

@Update()
export class TgBotService {
  constructor(
    private readonly userService: UserService,
    private readonly localizationService: TgBotLocalizationService,
  ) { }

  public showMainMenu = async (ctx: Context): Promise<void> => {
    const chosenLang =
      ctx.session.lang || ctx.from?.language_code || LangEnum.EN;
    const existingUserActions = EXISTING_USER_ACTIONS[chosenLang as LangEnum];
    const existingUserHeading =
      EXISTING_USER_ACTIONS_HEADING[chosenLang as LangEnum];
    await ctx.reply(existingUserHeading, {
      reply_markup: {
        inline_keyboard: existingUserActions,
      },
    });
  };

  @Start()
  async startCommand(@Ctx() ctx: Context): Promise<void> {
    const foundUser = await this.userService.findByTgId(ctx.from?.id as number);
    if (!foundUser) {
      await this.localizationService.handleFirstGreeting(ctx);
    } else {
      ctx.session.lang = foundUser.lang as LangEnum;
      await this.showMainMenu(ctx);
    }
  }

  @Action(new RegExp(`^${LangEventEnum.lang_select}:`))
  async onLangSelect(@Ctx() ctx: Context): Promise<void> {
    try {
      const callback = this.showMainMenu;
      await this.localizationService.langSelect(ctx, callback);
    } catch (e) {
      const errorMessage =
        e instanceof Error && e.message
          ? e.message
          : LANG_SELECT_ERROR_MESSAGE[
          ctx.from?.language_code as keyof typeof LANG_SELECT_ERROR_MESSAGE
          ];
      await ctx.answerCbQuery();
      console.error('Language selection error:', e);
      await ctx.reply(errorMessage);
    }
  }

  @Action(new RegExp(`^${LangEventEnum.lang_menu}`))
  async onLangChangeMenu(@Ctx() ctx: Context): Promise<void> {
    try {
      await this.localizationService.getLangMenu(ctx);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error && e.message
          ? e.message
          : LANG_SELECT_ERROR_MESSAGE[
          ctx.from?.language_code as keyof typeof LANG_SELECT_ERROR_MESSAGE
          ];
      console.error('Language selection error:', e);
      await ctx.reply(errorMessage);
      await ctx.answerCbQuery();
    }
  }

  @Action(new RegExp(`^${LangEventEnum.lang_change}`))
  async onLangChange(@Ctx() ctx: Context): Promise<void> {
    try {
      const callback = this.showMainMenu;
      await this.localizationService.langChange(ctx, callback);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : LANG_SELECT_ERROR_MESSAGE[
          ctx.from?.language_code as keyof typeof LANG_SELECT_ERROR_MESSAGE
          ];

      console.error('Language selection error:', e);
      await ctx.reply(errorMessage);
      await ctx.answerCbQuery();
    }
  }

  @Action(new RegExp(`^${NavigationEventsEnum.main_menu}`))
  async onMainMenu(@Ctx() ctx: Context): Promise<void> {
    try {
      await this.showMainMenu(ctx);
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('Services menu error:', e);
    }
  }

  @Action(new RegExp(`^${ServicesEventEnum.service_menu}`))
  async onServicesMenu(@Ctx() ctx: Context): Promise<void> {
    try {
      await this.localizationService.showServicesMenu(ctx);
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('Services menu error:', e);
    }
  }
}
