import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ServiceEnum } from 'src/common/enums';
import { IPromocodeCache } from '../interfaces';

@Injectable()
export class TgBotPromocodeCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) { }
  /*
    structure:
    tg-bot:promo:<tgBotUserId>:<serviceSlug>:<promocode> => {discountPercent: number, expiresAt: string, usageLimit: number}
    tg-bot:promo-user:<tgBotUserId>:<promocode> => <serviceSlug>
  */
  private readonly SERVICE_WITH_PROMO_PREFIX = 'tg-bot:promo';
  private readonly PROMO_USER_PREFIX = 'tg-bot:promo-user';
  private readonly TTL = 15 * 60 * 1000; //15 minutes
  private makeServiceWithUserAndPromoKey(
    tgBotUserId: number,
    serviceSlug: ServiceEnum,
  ): string {
    return `${this.SERVICE_WITH_PROMO_PREFIX}:${tgBotUserId}:${serviceSlug}`;
  }

  private makePromoUserKey(tgBotUserId: number, promocode: string): string {
    return `${this.PROMO_USER_PREFIX}:${tgBotUserId}:${promocode}`;
  }

  public async tryStore(
    tgBotUserId: number,
    serviceSlug: ServiceEnum,
    promocodeData: IPromocodeCache,
  ): Promise<boolean> {
    if (!tgBotUserId) throw new Error('Telegram user is not defined');

    const promoUserKey = this.makePromoUserKey(
      tgBotUserId,
      promocodeData.alias,
    );

    const promoAlreadyUsed = await this.cache.get<ServiceEnum | undefined>(
      promoUserKey,
    );

    const serviceWithUserAndPromoKey = this.makeServiceWithUserAndPromoKey(
      tgBotUserId,
      serviceSlug,
    );

    const promoAlreadyUsedWithService = await this.cache.get<
      IPromocodeCache | undefined
    >(serviceWithUserAndPromoKey);

    if (promoAlreadyUsedWithService) return false;

    if (promoAlreadyUsed) {
      //promoAlreadyUsed has value equal to serviceSlug, need to delete both keys to allow promocode usage for another service
      await this.cache.del(promoUserKey);
      const serviceKey = this.makeServiceWithUserAndPromoKey(
        tgBotUserId,
        promoAlreadyUsed,
      );
      await this.cache.del(serviceKey);
    }

    const promocodeDataWithoutAlias = {
      discountPercent: promocodeData.discountPercent,
      expiresAt: promocodeData.expiresAt,
      usageLimit: promocodeData.usageLimit,
    };

    await Promise.all([
      this.cache.set(
        serviceWithUserAndPromoKey,
        promocodeDataWithoutAlias,
        this.TTL,
      ),
      this.cache.set(promoUserKey, serviceSlug, this.TTL),
    ]);

    return true;
  }

  public async get(
    tgBotUserId: number,
    serviceSlug: ServiceEnum,
  ): Promise<IPromocodeCache | null> {
    if (!tgBotUserId) throw new Error('Telegram user is not defined');
    const key = this.makeServiceWithUserAndPromoKey(tgBotUserId, serviceSlug);
    const value = await this.cache.get<IPromocodeCache>(key);
    return value || null;
  }
}
