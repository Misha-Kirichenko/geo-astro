import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TgBotUser,
  TgBotUserDocument,
} from 'src/common/schemas/tg-bot-user.schema';
import { connections, SERVICES } from 'src/common/constants';
import {
  PromocodeUsage,
  PromocodeUsageDocument,
} from 'src/common/schemas/promocode-usage.schema';
import {
  Promocode,
  PromocodeDocument,
} from 'src/common/schemas/promocode.schema';
import { LangEnum } from 'src/common/enums';
import { clientMessagesUtil } from 'src/utils';
import {
  ClientMessageSourceEnum,
  PromocodeEventEnum,
  ServicesEventEnum,
} from '../enums';
import { RegExpContext } from 'src/common/interfaces';
import { BUY } from '../constants';
import { TgBotPromocodeCacheService } from './tg-bot-promocode-cache.service';

@Injectable()
export class TgBotPromocodeService {
  constructor(
    @InjectModel(TgBotUser.name, connections.DB_MASTER.alias)
    private readonly tgBotUserModel: Model<TgBotUserDocument>,
    @InjectModel(Promocode.name, connections.DB_MASTER.alias)
    private readonly promocodeModel: Model<PromocodeDocument>,
    @InjectModel(PromocodeUsage.name, connections.DB_MASTER.alias)
    private readonly promocodeUsageModel: Model<PromocodeUsageDocument>,
    private readonly promoCacheService: TgBotPromocodeCacheService,
  ) { }

  public async tryGetPriceWithPromo(ctx: RegExpContext): Promise<void> {
    const chosenLang = (ctx.session.lang ||
      ctx.from?.language_code ||
      LangEnum.EN) as LangEnum;

    if (
      ctx.session.step &&
      ctx.session.step === ServicesEventEnum.service_select &&
      ctx.session.serviceItem
    ) {
      const promocode = ctx.match[1].toUpperCase();
      if (!promocode) return;
      ctx.session['step'] = PromocodeEventEnum.promo_apply;

      const applyDate = new Date().toISOString().substring(0, 10);
      const promo = await this.promocodeModel.findOne(
        { alias: promocode },
        'expiresAt discountPercent',
      );
      if (!promo) {
        const message = clientMessagesUtil.notExists(
          ClientMessageSourceEnum.promocode,
          chosenLang,
        );
        await ctx.reply(message);
        return;
      }

      if (applyDate > promo.expiresAt) {
        const message = clientMessagesUtil.expired(
          ClientMessageSourceEnum.promocode,
          chosenLang,
        );

        await ctx.reply(message);
        return;
      }
      //todo: check if promocode is already applied

      const service = SERVICES[chosenLang].find(
        (item) => item.slug === ctx.session.serviceItem?.serviceSlug,
      );

      if (service) {
        const priceWithPromo =
          service.price - (service.price * promo.discountPercent) / 100;
        const message = clientMessagesUtil.promoApplied(chosenLang);
        await ctx.reply(message);
        //store pair of service name + promocode to determine final price later
        this.promoCacheService.store(promocode, service.slug, ctx);
        await ctx.reply(
          `<b>${service?.name}</b>\n\n<i>${service?.description}</i>\n\n`,
          {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `${BUY[chosenLang]}: ❌ ${service.price}ლ / ✅ ${priceWithPromo}ლ `,
                    callback_data: `${ServicesEventEnum.service_form}:${chosenLang}:${service.slug}:0`,
                  },
                ],
                [
                  {
                    text: '⬅️',
                    callback_data: `${ServicesEventEnum.service_menu}:${chosenLang}`,
                  },
                ],
              ],
            },
          },
        );
      }
    }

    return;
  }
}
