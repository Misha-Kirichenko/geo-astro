import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import {
  BACK,
  CHANGE_LANG_MESSAGE,
  GREETING_MESSAGE,
  LANG_CHANGE_SUCCESS_MESSAGE,
  SERVICE_LIST_HEADING,
} from '../constants';
import { LangEnum, ServiceEnum } from 'src/common/enums';
import { getLangKeyboard, messageUtil } from 'src/utils';
import { TShowMainMenuCallback } from '../types';
import { getServicesKeyboard } from 'src/utils/get-services-keyboard';
import { NavigationEventsEnum } from '../enums';
import { SERVICES } from 'src/common/constants';
import { TgBotUserService } from './tg-bot-user.service';
import { RegExpContext } from 'src/common/interfaces';
import { TgBotPromocodeCacheService } from './tg-bot-promocode-cache.service';
import { getKeyBoardWithPrice } from 'src/utils/get-keyboard-with-price';
import { TgBotFormCacheService } from './tg-bot-service-form-cache.service';

@Injectable()
export class TgBotLocalizationService {
  constructor(
    private readonly tgBotUserService: TgBotUserService,
    private readonly tgBotPromocodeCacheService: TgBotPromocodeCacheService,
    private readonly tgBotFormCacheService: TgBotFormCacheService,
  ) { }

  public async handleFirstGreeting(ctx: Context): Promise<void> {
    const selectedLang = (ctx.session.lang ||
      ctx.from?.language_code ||
      LangEnum.EN) as LangEnum;

    const langList = Object.values(LangEnum);
    if (selectedLang && langList.includes(selectedLang)) {
      const greetingMessage =
        GREETING_MESSAGE[selectedLang as keyof typeof GREETING_MESSAGE];

      const langSelectKeyboard = getLangKeyboard('lang_select');

      await ctx.reply(greetingMessage, {
        reply_markup: {
          inline_keyboard: langSelectKeyboard,
        },
      });
    }
    return;
  }

  private async saveUserWithLang(ctx: RegExpContext): Promise<void> {
    const chosenLang = ctx.match[1];
    if (!ctx.callbackQuery?.from) throw new Error('No ctx.from in callback');
    const { id, first_name, last_name, username } =
      ctx.callbackQuery.from || {};
    const userObj = {
      tgId: id,
      firstName: first_name,
      ...(last_name ? { lastName: last_name } : {}),
      ...(username ? { userName: username } : {}),
      lang: chosenLang,
    };

    await this.tgBotUserService.saveUser(userObj);
    ctx.session.lang = chosenLang as LangEnum;
  }

  public async langSelect(
    ctx: RegExpContext,
    showMainMenuCallback: TShowMainMenuCallback,
  ): Promise<void> {
    await this.saveUserWithLang(ctx);
    await ctx.answerCbQuery();
    await showMainMenuCallback(ctx);
  }

  public async getLangMenu(ctx: RegExpContext): Promise<void> {
    const headingMessage =
      CHANGE_LANG_MESSAGE[ctx.session.lang as keyof typeof CHANGE_LANG_MESSAGE];

    const langChangeKeyboard = getLangKeyboard('lang_change');

    await ctx.reply(headingMessage, {
      reply_markup: {
        inline_keyboard: [
          ...langChangeKeyboard,
          [
            {
              text: BACK[ctx.session.lang as LangEnum],
              callback_data: NavigationEventsEnum.main_menu,
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
    await this.saveUserWithLang(ctx);
    const successMessage =
      LANG_CHANGE_SUCCESS_MESSAGE[ctx.session.lang as LangEnum];
    await ctx.reply(successMessage);
    await showMainMenuCallback(ctx);
    await ctx.answerCbQuery();
  }

  public async showServicesMenu(ctx: RegExpContext): Promise<void> {
    const servicesKeyboardItems = getServicesKeyboard(
      ctx.session.lang as LangEnum,
    );
    const servicesKeyboard = {
      reply_markup: {
        inline_keyboard: [
          ...servicesKeyboardItems,
          [
            {
              text: BACK[ctx.session.lang as LangEnum],
              callback_data: NavigationEventsEnum.main_menu,
            },
          ],
        ],
      },
    };

    const serviceMenuHeading =
      SERVICE_LIST_HEADING[
      ctx.session.lang as keyof typeof SERVICE_LIST_HEADING
      ];
    await ctx.reply(serviceMenuHeading, servicesKeyboard);
  }

  public async getService(ctx: RegExpContext): Promise<void> {
    const serviceSlug = ctx.match[1] as ServiceEnum;
    if (!ctx.session.lang) throw new Error();
    if (!serviceSlug) throw new Error('Invalid service slug');

    const service = SERVICES[ctx.session.lang].find(
      (service) => service.slug === serviceSlug,
    );

    if (!service) throw new Error(messageUtil.ERRORS.notFound('Service'));
    ctx.session['serviceItem'] = service.slug;

    const cachedPromocode = await this.tgBotPromocodeCacheService.get(
      ctx.from?.id as number,
      service.slug,
    );

    const cachedFormData = await this.tgBotFormCacheService.getFormData(
      ctx.from?.id as number,
      serviceSlug,
    );

    const keyBoardWithPriceParamsObj = {
      ctx,
      service,
      ...(cachedPromocode && {
        discountPercent: cachedPromocode.discountPercent,
      }),
      ...(cachedFormData && { formDataStage: cachedFormData.stage }),
    };

    await getKeyBoardWithPrice(keyBoardWithPriceParamsObj);
  }
}
