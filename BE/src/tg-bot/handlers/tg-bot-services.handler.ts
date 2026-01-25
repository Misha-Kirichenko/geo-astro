import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';
import { EVENT_REGEX } from '../constants';
import { ServicesEventEnum } from '../enums';
import { TgBotPromocodeService } from '../services/tg-bot-promocode-service';
import type { RegExpContext } from 'src/common/interfaces';
import { TgBotServiceFormService } from '../services/tg-bot-service-form.service';
import { TgBotFormCacheService } from '../services/tg-bot-service-form-cache.service';
import { ServiceEnum } from 'src/common/enums';

@Update()
export class TgBotServicesHandler {
  constructor(
    private readonly tgBotPromocodeService: TgBotPromocodeService,
    private readonly tgBotServiceFormService: TgBotServiceFormService,
    private readonly formCacheService: TgBotFormCacheService,
  ) {}

  @Hears(EVENT_REGEX.promocode)
  async onPromocodeEnter(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      await this.tgBotPromocodeService.tryGetPriceWithPromo(ctx);
    } catch (e) {
      await ctx.answerCbQuery();
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
      await ctx.answerCbQuery();
      console.error('form data input error:', e);
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
}
