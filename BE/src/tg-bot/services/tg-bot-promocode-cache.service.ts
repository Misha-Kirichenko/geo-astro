import { Injectable } from '@nestjs/common';
import { ServiceEnum } from 'src/common/enums';
import { Context } from 'telegraf';

//todo: rewrite using REDIS
@Injectable()
export class TgBotPromocodeCacheService {
  public store(
    promocode: string,
    serviceSlug: ServiceEnum,
    ctx: Context,
  ): void {
    ctx.session['serviceItem'] = {};
    ctx.session['serviceItem']['serviceSlug'] = serviceSlug;
    ctx.session['serviceItem']['promocode'] = promocode;
  }
}
