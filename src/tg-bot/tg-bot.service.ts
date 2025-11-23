import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import {
  EXISTING_USER_ACTIONS,
  EXISTING_USER_ACTIONS_HEADING,
  LANG_SELECT_ERROR_MESSAGE,
} from './constants';
import { LangEnum } from 'src/common/enums';
import { UserService } from 'src/user/user.service';
import { LangEventEnum } from './enums/lang-events.enum';
import { TgBotLocalizationService } from './tg-bot-localization.service';

@Update()
export class TgBotService {
  constructor(
    private readonly userService: UserService,
    private readonly localizationService: TgBotLocalizationService,
  ) { }

  public showMainMenu = async (ctx: Context, lang: LangEnum): Promise<void> => {
    const existingUserActions = EXISTING_USER_ACTIONS[lang];
    const existingUserHeading = EXISTING_USER_ACTIONS_HEADING[lang];
    await ctx.reply(existingUserHeading, {
      reply_markup: {
        inline_keyboard: existingUserActions,
      },
    });
  };

  @Start()
  async startCommand(@Ctx() ctx: Context): Promise<void> {
    const foundUser = await this.userService.findByTgId(ctx.from?.id as number);
    if (!foundUser) await this.localizationService.handleFirstGreeting(ctx);
    else await this.showMainMenu(ctx, foundUser.lang);
  }

  @Action(new RegExp(`^${LangEventEnum.lang_select}:`))
  async onLangSelect(@Ctx() ctx: Context): Promise<void> {
    try {
      const callback = this.showMainMenu;
      await this.localizationService.langSelect(ctx, callback);
    } catch (e) {
      const errorMessage =
        LANG_SELECT_ERROR_MESSAGE[
          ctx.from?.language_code as keyof typeof LANG_SELECT_ERROR_MESSAGE
        ];

      console.error('Language selection error:', e);
      await ctx.reply(errorMessage);
    }
  }

  @Action(new RegExp(`^${LangEventEnum.lang_menu}`))
  async onLangMenu(@Ctx() ctx: Context): Promise<void> {
    try {
      await this.localizationService.geLangMenu(ctx);
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
    try {
      const callback = this.showMainMenu;
      await this.localizationService.langChange(ctx, callback);
    } catch (e) {
      const errorMessage =
        LANG_SELECT_ERROR_MESSAGE[
        ctx.from?.language_code as keyof typeof LANG_SELECT_ERROR_MESSAGE
        ];

      console.error('Language selection error:', e);
      await ctx.reply(errorMessage);
    }
  }
}
