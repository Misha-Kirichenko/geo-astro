import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { IPromocodeCache } from '../interfaces';

@Injectable()
export class TgBotPromocodeCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) { }
  /*
    structure:
    tg-bot:promo-user:<tgBotUserId> => {promocode: string, serviceSlug: SeviceEnum, discountPercent: number, expiresAt: string, usageLimit: number}
  */
  private readonly PROMO_USER_PREFIX = 'tg-bot:promo-user';
  private readonly TTL = 15 * 60 * 1000; //15 minutes

  private makePromoUserKey(tgBotUserId: number): string {
    return `${this.PROMO_USER_PREFIX}:${tgBotUserId}`;
  }

  public async tryStore(
    tgBotUserId: number,
    promocodeData: IPromocodeCache,
  ): Promise<boolean> {
    if (!tgBotUserId) throw new Error('Telegram user is not defined');

    const promoUserKey = this.makePromoUserKey(tgBotUserId);

    const promoAlreadyUsedWithService = await this.cache.get<
      IPromocodeCache | undefined
    >(promoUserKey);

    if (promoAlreadyUsedWithService?.serviceSlug === promocodeData.serviceSlug)
      return false;

    const promocodeDataWithService = {
      promocode: promocodeData.promocode,
      discountPercent: promocodeData.discountPercent,
      expiresAt: promocodeData.expiresAt,
      usageLimit: promocodeData.usageLimit,
      serviceSlug: promocodeData.serviceSlug,
    };

    await this.cache.set(promoUserKey, promocodeDataWithService, this.TTL);

    return true;
  }

  public async get(tgBotUserId: number): Promise<IPromocodeCache | null> {
    if (!tgBotUserId) throw new Error('Telegram user is not defined');
    const key = this.makePromoUserKey(tgBotUserId);
    const value = await this.cache.get<IPromocodeCache>(key);
    return value || null;
  }
}
