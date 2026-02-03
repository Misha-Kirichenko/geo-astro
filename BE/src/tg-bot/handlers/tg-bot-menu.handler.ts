import { Action, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import {
  EVENT_REGEX,
  EXISTING_USER_ACTIONS,
  EXISTING_USER_ACTIONS_HEADING,
  LANG_SELECT_ERROR_MESSAGE,
} from '../constants';
import { LangEnum } from 'src/common/enums';
import { TgBotUserService } from '../services/tg-bot-user.service';
import {
  LangEventEnum,
  NavigationEventsEnum,
  ServicesEventEnum,
} from '../enums';
import { TgBotLocalizationService } from '../services/tg-bot-localization.service';
import type { RegExpContext } from 'src/common/interfaces';

@Update()
export class TgBotMenuHandler {
  constructor(
    private readonly tgBotUserService: TgBotUserService,
    private readonly localizationService: TgBotLocalizationService,
  ) { }

  public showMainMenu = async (ctx: Context): Promise<void> => {
    const existingUserActions =
      EXISTING_USER_ACTIONS[ctx.session.lang as LangEnum];
    const existingUserHeading =
      EXISTING_USER_ACTIONS_HEADING[ctx.session.lang as LangEnum];
    await ctx.reply(existingUserHeading, {
      reply_markup: {
        inline_keyboard: existingUserActions,
      },
    });
  };

  @Start()
  async startCommand(@Ctx() ctx: Context): Promise<void> {
    const foundUser = await this.tgBotUserService.findByTgId(
      ctx.from?.id as number,
    );
    if (!foundUser) await this.localizationService.handleFirstGreeting(ctx);
    else await this.showMainMenu(ctx);
    await ctx.answerCbQuery();
  }

  @Hears(EVENT_REGEX.main_menu_nav)
  async onNavMainMenu(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      const msg = await ctx.reply('...', Markup.removeKeyboard());
      await ctx.deleteMessage(msg.message_id);
      await this.showMainMenu(ctx);
      ctx.session['step'] = NavigationEventsEnum.main_menu;
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('nav main menu error:', e);
    }
  }

  @Action(EVENT_REGEX.lang_select)
  async onLangSelect(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      ctx.session['step'] = LangEventEnum.lang_select;
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

  @Action(EVENT_REGEX.lang_menu)
  async onLangChangeMenu(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      ctx.session['step'] = LangEventEnum.lang_menu;
      await this.localizationService.getLangMenu(ctx);
      await ctx.answerCbQuery();
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

  @Action(EVENT_REGEX.lang_change)
  async onLangChange(@Ctx() ctx: RegExpContext): Promise<void> {
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

  @Action(EVENT_REGEX.main_menu)
  async onMainMenu(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      ctx.session['step'] = NavigationEventsEnum.main_menu;
      await this.showMainMenu(ctx);
      await ctx.answerCbQuery();
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('main menu error:', e);
    }
  }

  @Action(EVENT_REGEX.service_select)
  async onServiceSelect(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      ctx.session['step'] = ServicesEventEnum.service_select;
      await this.localizationService.getService(ctx);
      await ctx.answerCbQuery();
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('Services menu error:', e);
    }
  }

  @Hears(EVENT_REGEX.services_menu_nav)
  async onNavServicesMenu(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      const msg = await ctx.reply('...', Markup.removeKeyboard());
      await ctx.deleteMessage(msg.message_id);
      await this.localizationService.showServicesMenu(ctx);
      ctx.session['step'] = ServicesEventEnum.service_menu;
      await ctx.answerCbQuery();
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('nav main menu error:', e);
    }
  }

  @Action(EVENT_REGEX.service_menu)
  async onServicesMenu(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      await this.localizationService.showServicesMenu(ctx);
      ctx.session['step'] = ServicesEventEnum.service_menu;
      await ctx.answerCbQuery();
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('Services menu error:', e);
    }
  }
}
