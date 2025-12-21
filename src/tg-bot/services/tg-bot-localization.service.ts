import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import {
  BUY,
  CHANGE_LANG_MESSAGE,
  GREETING_MESSAGE,
  LANG_CHANGE_SUCCESS_MESSAGE,
  SERVICE_LIST_HEADING,
} from '../constants';
import { LangEnum, ServiceEnum } from 'src/common/enums';
import { getLangKeyboard, messageUtil } from 'src/utils';
import { TShowMainMenuCallback } from '../types';
import { getServicesKeyboard } from 'src/utils/get-services-keyboard';
import { NavigationEventsEnum, ServicesEventEnum } from '../enums';
import { SERVICES } from 'src/common/constants';
import { TgBotUserService } from './tg-bot-user.service';
import { RegExpContext } from 'src/common/interfaces';

@Injectable()
export class TgBotLocalizationService {
  constructor(private readonly tgBotUserService: TgBotUserService) { }

  private determineAndSetLang(ctx: RegExpContext): LangEnum {
    const lang = ctx.match[1] as LangEnum;
    if (!lang) throw new Error('No language was set');
    ctx.session.lang = lang;
    return lang;
  }

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

    await this.tgBotUserService.saveUser(
      userObj,
      ctx.callbackQuery.from.language_code as LangEnum,
    );
  }

  public async langSelect(
    ctx: RegExpContext,
    showMainMenuCallback: TShowMainMenuCallback,
  ): Promise<void> {
    const lang = this.determineAndSetLang(ctx);
    await this.saveUserWithLang(ctx, lang);
    await ctx.answerCbQuery();
    await showMainMenuCallback(ctx, lang);
  }

  public async getLangMenu(ctx: RegExpContext): Promise<void> {
    const lang = this.determineAndSetLang(ctx);
    const headingMessage =
      CHANGE_LANG_MESSAGE[lang as keyof typeof CHANGE_LANG_MESSAGE];

    await ctx.answerCbQuery();
    const langChangeKeyboard = getLangKeyboard('lang_change');

    await ctx.reply(headingMessage, {
      reply_markup: {
        inline_keyboard: [
          ...langChangeKeyboard,
          [
            {
              text: '⬅️',
              callback_data: `${NavigationEventsEnum.main_menu}:${lang}`,
            },
          ],
        ],
      },
    });
  }

  public async langChange(
    ctx: RegExpContext,
    showMainMenuCallback: TShowMainMenuCallback,
  ): Promise<void> {
    const lang = this.determineAndSetLang(ctx);
    await this.saveUserWithLang(ctx, lang);
    const successMessage = LANG_CHANGE_SUCCESS_MESSAGE[lang];
    await ctx.reply(successMessage);
    await showMainMenuCallback(ctx, lang);
    await ctx.answerCbQuery();
  }

  public async showServicesMenu(ctx: RegExpContext): Promise<void> {
    const lang = this.determineAndSetLang(ctx);
    const servicesKeyboardItems = getServicesKeyboard(lang);
    const servicesKeyboard = {
      reply_markup: {
        inline_keyboard: [
          ...servicesKeyboardItems,
          [
            {
              text: '⬅️',
              callback_data: `${NavigationEventsEnum.main_menu}:${lang}`,
            },
          ],
        ],
      },
    };

    const serviceMenuHeading =
      SERVICE_LIST_HEADING[lang as keyof typeof SERVICE_LIST_HEADING];
    await ctx.reply(serviceMenuHeading, servicesKeyboard);
    await ctx.answerCbQuery();
  }

  public async getService(ctx: RegExpContext): Promise<void> {
    const lang = this.determineAndSetLang(ctx);
    const serviceSlug = ctx.match[2];
    if (!lang) throw new Error();
    if (!serviceSlug) throw new Error('Invalid service slug');

    const service = SERVICES[lang].find(
      (service) => service.slug === (serviceSlug as ServiceEnum),
    );

    if (!service) throw new Error(messageUtil.ERRORS.notFound('Service'));

    ctx.session['serviceItem'] = {};
    ctx.session['serviceItem']['serviceSlug'] = service.slug;
    await ctx.reply(
      `<b>${service?.name}</b>\n\n<i>${service?.description}</i>\n\n`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `${BUY[lang]}: ${service?.price}ლ`,
                callback_data: `${ServicesEventEnum.service_form}:${lang}:${service.slug}:0`,
              },
              {
                text: '⬅️',
                callback_data: `${ServicesEventEnum.service_menu}:${lang}`,
              },
            ],
          ],
        },
      },
    );
    await ctx.answerCbQuery();
  }
}
