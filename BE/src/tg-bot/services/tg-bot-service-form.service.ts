import { Injectable } from '@nestjs/common';
import { LangEnum, ServiceEnum } from 'src/common/enums';
import { RegExpContext } from 'src/common/interfaces';
import { CHOOSE_ACTION, FILL_FORM } from '../constants';
import { SERVICE_FORM_VALIDATION } from '../validation/service-form.validation';
import { getFormPreviewUtil, getNavMenu } from 'src/utils';
import { TgBotFormCacheService } from './tg-bot-service-form-cache.service';
import { IFormData } from '../interfaces';
import { TFullFormData, TPartialForms } from '../types';
import { Context } from 'telegraf';

@Injectable()
export class TgBotServiceFormService {
  constructor(private readonly formCacheService: TgBotFormCacheService) { }
  public async startFromScratch(ctx: RegExpContext): Promise<void> {
    await this.formCacheService.removeKey(
      ctx.from?.id as number,
      ctx.session.serviceItem as ServiceEnum,
    );
    await this.getFistStageTip(ctx);
  }

  public async showFormPreview(
    ctx: Context,
    existingForm: TFullFormData | TPartialForms,
  ): Promise<void> {
    const { serviceItem: serviceName, lang } = ctx.session;
    const formPreview = getFormPreviewUtil(
      serviceName as ServiceEnum,
      existingForm,
      lang as LangEnum,
    );

    await ctx.reply(formPreview, {
      parse_mode: 'HTML' as const,
    });
  }

  public async runPrevStage(ctx: RegExpContext): Promise<void> {
    if (!ctx.session.serviceItem) return;
    const currentFormData = await this.formCacheService.getFormData(
      ctx.from!.id,
      ctx.session.serviceItem,
    );

    if (!currentFormData) return;
    if (currentFormData.stage) currentFormData.stage--;
    await this.formCacheService.resetFormDataToPrevStage(
      ctx.from?.id as number,
      ctx.session.serviceItem,
      currentFormData,
    );
    // await this.formCacheService.setFormData(
    //   ctx.from?.id as number,
    //   ctx.session.serviceItem,
    //   currentFormData,
    // );

    await this.getNextStageTip(ctx, currentFormData);
  }

  public async runStage(
    ctx: RegExpContext,
    existingForm?: TFullFormData | TPartialForms | null,
  ): Promise<void> {
    if (!ctx.session.serviceItem) return;
    const fieldValue = ctx.match[0];

    let currentFormData =
      existingForm ||
      (await this.formCacheService.getFormData(
        ctx.from!.id,
        ctx.session.serviceItem,
      ));

    if (!currentFormData) {
      currentFormData = await this.formCacheService.ininializeForm(
        ctx.from!.id,
        ctx.session.serviceItem,
      );
    }

    const { lang: currentLang } = ctx.session;
    const serviceFormValidationObj = SERVICE_FORM_VALIDATION(
      currentLang as LangEnum,
    );
    const rules = serviceFormValidationObj[ctx.session.serviceItem];
    if (!rules) return;
    const rule = rules[Number(currentFormData?.stage)];
    if (!rule) return;
    const fieldValid = rule.validator(fieldValue);

    if (!fieldValid) {
      await ctx.reply(rule.errorMessage);
      return;
    }

    if (ctx.session.serviceItem === ServiceEnum.synastry) {
      const form1FilledFieldsCount = Object.keys(currentFormData.form1).length;
      if (form1FilledFieldsCount < rules.length / 2) {
        currentFormData.form1[rule.fieldName] = fieldValue;
      } else {
        currentFormData.form2[rule.fieldName] = fieldValue;
      }
    } else {
      currentFormData.form1[rule.fieldName] = fieldValue;
    }
    currentFormData.stage++;
    await this.formCacheService.setFormData(
      ctx.from?.id as number,
      ctx.session.serviceItem,
      currentFormData,
    );

    await this.getNextStageTip(ctx, currentFormData);
  }

  public async getNextStageTip(
    ctx: RegExpContext,
    formData: Partial<IFormData> | TFullFormData | TPartialForms,
  ): Promise<void> {
    //todo - write logic for case session is lost
    if (
      !ctx.session.serviceItem ||
      !ctx.session.serviceItem ||
      !('stage' in formData)
    ) {
      return;
    }
    const currentLang =
      ctx.session.lang || ctx.from?.language_code || LangEnum.EN;
    const serviceFormValidationObj = SERVICE_FORM_VALIDATION(
      currentLang as LangEnum,
    );
    const rules = serviceFormValidationObj[ctx.session.serviceItem];
    if (!rules) return;
    if (formData.stage < rules.length) {
      const rule = rules[Number(formData.stage)];
      const replyKeyboard = getNavMenu(ctx, formData);
      await ctx.reply(rule.fieldTip, replyKeyboard);
    } else {
      const replyKeyboard = getNavMenu(ctx, formData);
      await ctx.reply(CHOOSE_ACTION[currentLang as LangEnum], replyKeyboard);
    }
    return;
  }

  public async getFistStageTip(ctx: RegExpContext): Promise<void> {
    const [, serviceSlug, stage] = ctx.match;
    if (!serviceSlug) return;
    const message = FILL_FORM[ctx.session.lang as LangEnum];
    await ctx.reply(message);
    const serviceFormValidationObj = SERVICE_FORM_VALIDATION(
      ctx.session.lang as LangEnum,
    );
    const rules = serviceFormValidationObj[serviceSlug as ServiceEnum];
    if (!rules) return;
    const rule = rules[Number(stage)];
    if (!rule) return;
    if (ctx.session.serviceItem) {
      const formData = await this.formCacheService.ininializeForm(
        ctx.from!.id,
        ctx.session.serviceItem,
      );
      const replyKeyboard = getNavMenu(ctx, formData);
      await ctx.reply(rule.fieldTip, replyKeyboard);
    }
  }
}
