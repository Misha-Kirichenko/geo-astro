import { Injectable } from '@nestjs/common';
import { Context, Markup, MiddlewareFn } from 'telegraf';
import { ServicesEventEnum } from '../enums';

@Injectable()
export class NavKeyboardMiddleware {
  public getMiddleware(): MiddlewareFn<Context> {
    return async (ctx: Context, next) => {
      if (ctx.session['step'] !== ServicesEventEnum.service_form) {
        await ctx.reply('-', Markup.removeKeyboard());
      }
      return next();
    };
  }
}
