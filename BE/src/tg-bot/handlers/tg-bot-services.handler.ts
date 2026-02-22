import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';
import { EVENT_REGEX } from '../constants';
import { ServicesEventEnum } from '../enums';
import { TgBotPromocodeService } from '../services/tg-bot-promocode-service';
import type { RegExpContext } from 'src/common/interfaces';
import { TgBotServiceFormService } from '../services/tg-bot-service-form.service';
import { TgBotFormCacheService } from '../services/tg-bot-service-form-cache.service';
import { LangEnum, ServiceEnum } from 'src/common/enums';
import { SERVICE_FORM_VALIDATION } from '../validation/service-form.validation';

@Update()
export class TgBotServicesHandler {
  constructor(
    private readonly tgBotPromocodeService: TgBotPromocodeService,
    private readonly tgBotServiceFormService: TgBotServiceFormService,
    private readonly formCacheService: TgBotFormCacheService,
  ) { }

  @Hears(EVENT_REGEX.promocode)
  async onPromocodeEnter(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      await this.tgBotPromocodeService.tryGetPriceWithPromo(ctx);
    } catch (e) {
      console.error('promocode input error:', e);
    }
  }

  @Action(EVENT_REGEX.service_form)
  async onServiceForm(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      ctx.session['step'] = ServicesEventEnum.service_form;
      await this.tgBotServiceFormService.getFistStageTip(ctx);
      await ctx.answerCbQuery();
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('Services form error:', e);
    }
  }

  @Hears(EVENT_REGEX.prev_stage_nav)
  async onPrevStage(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      if (ctx.session['step'] === ServicesEventEnum.service_form)
        await this.tgBotServiceFormService.runPrevStage(ctx);
    } catch (e) {
      console.error('form data input error:', e);
    }
  }

  @Hears(EVENT_REGEX.view_form)
  async onViewForm(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      const formData = await this.formCacheService.getFormData(
        ctx.from?.id as number,
        ctx.session.serviceItem as ServiceEnum,
      );
      if (formData)
        await this.tgBotServiceFormService.showFormPreview(ctx, formData);
    } catch (e) {
      console.error('form data input error:', e);
    }
  }

  @Hears(EVENT_REGEX.fill_form_from_scratch)
  async onFillFormFromScratch(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      await this.tgBotServiceFormService.startFromScratch(ctx);
    } catch (e) {
      console.error('form data input error:', e);
    }
  }

  @Action(EVENT_REGEX.service_form_continue)
  async onServiceFormFillContinue(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      ctx.session['step'] = ServicesEventEnum.service_form;
      const formData = await this.formCacheService.getFormData(
        ctx.from?.id as number,
        ctx.session.serviceItem as ServiceEnum,
      );
      if (formData) {
        await this.tgBotServiceFormService.showFormPreview(ctx, formData);
        await this.tgBotServiceFormService.getNextStageTip(ctx, formData);
      }

      await ctx.answerCbQuery();
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('Services form error:', e);
    }
  }

  @Action(EVENT_REGEX.back_to_form_fill)
  async onBackToFormFill(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      const formData = await this.formCacheService.getFormData(
        ctx.from?.id as number,
        ctx.session.serviceItem as ServiceEnum,
      );

      if (formData) {
        const currentLang =
          ctx.session.lang || ctx.from?.language_code || LangEnum.EN;
        const serviceFormValidationObj = SERVICE_FORM_VALIDATION(
          currentLang as LangEnum,
        );

        if (!ctx.session.serviceItem) return;
        const rules = serviceFormValidationObj[ctx.session.serviceItem];
        if (!rules) return;
        if (formData.stage >= rules.length) {
          ctx.session['step'] = ServicesEventEnum.service_form;
          await this.tgBotServiceFormService.getNextStageTip(ctx, formData);
        }
      }

      await ctx.answerCbQuery();
    } catch (e) {
      await ctx.answerCbQuery();
      console.error(`${EVENT_REGEX.back_to_form_fill} event error`, e);
    }
  }

  @Hears(/^([\s\S]+)$/)
  async onFormFill(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      if (ctx.session['step'] === ServicesEventEnum.service_form)
        await this.tgBotServiceFormService.runStage(ctx);
    } catch (e) {
      console.error('form data input error:', e);
    }
  }
}
