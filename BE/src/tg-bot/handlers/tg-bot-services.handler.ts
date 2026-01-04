import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';
import { EVENT_REGEX } from '../constants';
import { ServicesEventEnum } from '../enums';
import { TgBotPromocodeService } from '../services/tg-bot-promocode-service';
import type { RegExpContext } from 'src/common/interfaces';
import { TgBotServiceFormService } from '../services/tg-bot-service-form.service';

@Update()
export class TgBotServicesHandler {
  constructor(
    private readonly tgBotPromocodeService: TgBotPromocodeService,
    private readonly tgBotServiceFormService: TgBotServiceFormService,
  ) {}

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
    } catch (e) {
      await ctx.answerCbQuery();
      console.error('Services form error:', e);
    }
  }

  @Hears(EVENT_REGEX.form_data_input)
  async onFormFill(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      if (ctx.session['step'] === ServicesEventEnum.service_form) {
        await this.tgBotServiceFormService.runStage(ctx);
      }
      return;
    } catch (e) {
      console.error('form data input error:', e);
    }
  }
}
