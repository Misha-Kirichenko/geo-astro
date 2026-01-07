import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ServiceEnum } from 'src/common/enums';
import { IFormData } from '../interfaces';
import { TFullFormData, TPartialForms } from '../types';

@Injectable()
export class TgBotFormCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) { }
  /*
    structure: tg-bot:form:<tgBotUserId>:<serviceSlug> => 
    {
      form1: {fullName: string, birthDate: string, birthTime: string}, 
      form2?: {fullName: string, birthDate: string, birthTime: string}, 
      createdAt: number, updatedAt: number
      stage: number
    }
    
  */
  private readonly FORM_PREFIX = 'tg-bot:form';

  private makeKey(tgBotUserId: number, serviceSlug: string): string {
    return `${this.FORM_PREFIX}:${tgBotUserId}:${serviceSlug}`;
  }

  public async ininializeForm(
    tgBotUserId: number,
    serviceSlug: ServiceEnum,
  ): Promise<TPartialForms> {
    const key = this.makeKey(tgBotUserId, serviceSlug);
    const now = Date.now();
    const data = {
      form1: {},
      form2: {},
      createdAt: now,
      updatedAt: now,
      stage: 0,
    };
    await this.cache.set(key, data);
    return data;
  }

  public isFullFormData(
    data: TFullFormData | TPartialForms,
    serviceSlug: ServiceEnum,
  ): data is TFullFormData {
    const f1 = data.form1;
    const hasFullForm1 = Boolean(
      f1 && f1.fullName && f1.birthDate && f1.birthTime && f1,
    );
    if (serviceSlug === ServiceEnum.synastry) {
      const f2 = data.form2;
      const hasFullForm2 =
        !f2 || Boolean(f2.fullName && f2.birthDate && f2.birthTime);
      return hasFullForm1 && hasFullForm2;
    }
    return hasFullForm1;
  }

  public async getFormData(
    tgBotUserId: number,
    serviceSlug: ServiceEnum,
  ): Promise<TFullFormData | TPartialForms | null> {
    const key = this.makeKey(tgBotUserId, serviceSlug);
    const formData = await this.cache.get<
      TFullFormData | TPartialForms | undefined
    >(key);
    return formData || null;
  }

  public async setFormData(
    tgBotUserId: number,
    serviceSlug: ServiceEnum,
    formData: Partial<IFormData> | TFullFormData | TPartialForms,
  ): Promise<void> {
    const key = this.makeKey(tgBotUserId, serviceSlug);
    await this.cache.set(key, {
      ...formData,
      updatedAt: Date.now(),
    });
  }
}
