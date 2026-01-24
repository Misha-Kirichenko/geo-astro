import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TgBotUser,
  TgBotUserDocument,
} from 'src/database/schemas/tg-bot-user.schema';
import { connections, SERVICES } from 'src/common/constants';
import {
  PromocodeUsage,
  PromocodeUsageDocument,
} from 'src/database/schemas/promocode-usage.schema';
import {
  Promocode,
  PromocodeDocument,
} from 'src/database/schemas/promocode.schema';
import { LangEnum } from 'src/common/enums';
import { clientMessagesUtil } from 'src/utils';
import {
  ClientMessageSourceEnum,
  PromocodeEventEnum,
  ServicesEventEnum,
} from '../enums';
import { RegExpContext } from 'src/common/interfaces';
import { TgBotPromocodeCacheService } from './tg-bot-promocode-cache.service';
import { getKeyBoardWithPrice } from 'src/utils/get-keyboard-with-price';
import { TgBotFormCacheService } from './tg-bot-service-form-cache.service';

@Injectable()
export class TgBotPromocodeService {
  constructor(
    @InjectModel(TgBotUser.name, connections.DB_MASTER.alias)
    private readonly tgBotUserModel: Model<TgBotUserDocument>,
    @InjectModel(Promocode.name, connections.DB_MASTER.alias)
    private readonly promocodeModel: Model<PromocodeDocument>,
    @InjectModel(PromocodeUsage.name, connections.DB_MASTER.alias)
    private readonly promocodeUsageModel: Model<PromocodeUsageDocument>,
    private readonly tgBotFormCacheService: TgBotFormCacheService,
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

      //todo: check if promocode is already used by this user and validate usage limit

      const service = SERVICES[chosenLang].find(
        (item) => item.slug === ctx.session.serviceItem,
      );

      if (service) {
        const applyDate = new Date().toISOString().substring(0, 10);
        if (applyDate > promo.expiresAt) {
          const message = clientMessagesUtil.expired(
            ClientMessageSourceEnum.promocode,
            chosenLang,
          );

          await ctx.reply(message);
          return;
        }
        //store pair of service name and promocode to determine final price later
        const promocodeData = {
          alias: promocode,
          discountPercent: promo.discountPercent,
          expiresAt: promo.expiresAt,
          usageLimit: promo.usageLimit,
        };

        const isStored = await this.promoCacheService.tryStore(
          ctx.from?.id as number,
          service.slug,
          promocodeData,
        );

        const cachedFormData = await this.tgBotFormCacheService.getFormData(
          ctx.from?.id as number,
          service.slug,
        );

        if (isStored) {
          const keyBoardWithPriceParamsObj = {
            ctx,
            service,
            ...(isStored && {
              discountPercent: promo.discountPercent,
            }),
            ...(cachedFormData && { formDataStage: cachedFormData.stage }),
          };

          await ctx.reply(clientMessagesUtil.promoApplied(chosenLang));
          await getKeyBoardWithPrice(keyBoardWithPriceParamsObj);
        }
      }
    }

    return;
  }
}
