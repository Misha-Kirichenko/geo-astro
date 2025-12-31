import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Context, MiddlewareFn } from 'telegraf';
import { TgBotUserService } from '../services';
import { LangEnum } from 'src/common/enums';

@Injectable()
export class LangMiddleware {
  constructor(private moduleRef: ModuleRef) { }

  public getMiddleware(): MiddlewareFn<Context> {
    return async (ctx, next) => {
      if (!ctx.session) ctx.session = {};
      if (!ctx.from) return next();

      if (!ctx.session?.lang) {
        const userService = this.moduleRef.get(TgBotUserService, {
          strict: false,
        });
        const user = await userService.findByTgId(ctx.from.id);
        ctx.session['lang'] =
          (user?.lang as LangEnum) ||
          (ctx.from.language_code as LangEnum) ||
          LangEnum.EN;
      }

      return next();
    };
  }
}
