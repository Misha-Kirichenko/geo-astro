import { Ctx, Hears, Update } from 'nestjs-telegraf';
import { EVENT_REGEX } from '../constants';
import { TgBotPaymentsMenuService } from '../services';
import type { RegExpContext } from 'src/common/interfaces';

@Update()
export class TgBotPaymentsMenuHandler {
  constructor(
    private readonly tgBotPaymentsMenuService: TgBotPaymentsMenuService,
  ) {}

  @Hears(EVENT_REGEX.go_to_payments_menu)
  async onGoToPayments(@Ctx() ctx: RegExpContext): Promise<void> {
    try {
      console.log('Go to payments menu');
      await this.tgBotPaymentsMenuService.handleGoToPaymentsMenu(ctx);
    } catch (e) {
      console.error('"Go to payments" menu error:', e);
    }
  }
}
