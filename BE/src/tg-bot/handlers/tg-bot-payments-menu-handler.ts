import { Ctx, Hears, Update } from 'nestjs-telegraf';
import { EVENT_REGEX } from '../constants';
import { TgBotPaymentsMenuService } from '../services';
import type { RegExpContext } from 'src/common/interfaces';
import { PaymentStepEnum } from '../enums';
import { Markup } from 'telegraf';

@Update()
export class TgBotPaymentsMenuHandler {
  constructor(
    private readonly tgBotPaymentsMenuService: TgBotPaymentsMenuService,
  ) {}

  @Hears(EVENT_REGEX.go_to_payments_menu)
  async onGoToPayments(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      const msg = await ctx.reply('...', Markup.removeKeyboard());
      await ctx.deleteMessage(msg.message_id);
      await this.tgBotPaymentsMenuService.handleGoToPaymentsMenu(ctx);
      ctx.session.step = PaymentStepEnum.select_payment_type;
    } catch (e) {
      console.error(`${EVENT_REGEX.go_to_payments_menu} event error`, e);
    }
  }
}
