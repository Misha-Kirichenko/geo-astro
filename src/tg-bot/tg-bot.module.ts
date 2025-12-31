import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { Context, session } from 'telegraf';
import { ModuleRef } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { TgBotMenuHandler, TgBotServicesHandler } from './handlers';
import {
  TgBotLocalizationService,
  TgBotPromocodeService,
  TgBotUserService,
  TgBotPromocodeCacheService,
  TgBotServiceFormService,
} from './services';

import { DatabaseModule } from 'src/database/database.module';
import { connections } from 'src/common/constants';
import {
  TgBotUser,
  TgBotUserSchema,
} from 'src/database/schemas/tg-bot-user.schema';
import {
  Promocode,
  PromocodeSchema,
} from 'src/database/schemas/promocode.schema';
import {
  PromocodeUsage,
  PromocodeUsageSchema,
} from 'src/database/schemas/promocode-usage.schema';

import { LangMiddleware } from './middlewares/lang.middleware';
import { NavKeyboardMiddleware } from './middlewares/nav-keyboard.middleware';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature(
      [
        { name: TgBotUser.name, schema: TgBotUserSchema },
        { name: Promocode.name, schema: PromocodeSchema },
        { name: PromocodeUsage.name, schema: PromocodeUsageSchema },
      ],
      connections.DB_MASTER.alias,
    ),
    TelegrafModule.forRootAsync({
      inject: [ConfigService, ModuleRef],
      useFactory: (configService: ConfigService, moduleRef: ModuleRef) => {
        const token = configService.get<string>('TG_BOT_TOKEN');
        if (!token) throw new Error('TG_BOT_TOKEN is not defined in .env');

        const langMiddleware = new LangMiddleware(moduleRef);
        const keyboardMiddleware = new NavKeyboardMiddleware();

        return {
          token,
          middlewares: [
            session(),
            langMiddleware.getMiddleware(),
            keyboardMiddleware.getMiddleware(),
          ],
        };
      },
    }),
  ],
  providers: [
    TgBotMenuHandler,
    TgBotLocalizationService,
    TgBotUserService,
    TgBotPromocodeService,
    TgBotPromocodeCacheService,
    TgBotServicesHandler,
    TgBotServiceFormService,
    LangMiddleware,
    NavKeyboardMiddleware,
  ],
  exports: [MongooseModule],
})
export class TgBotModule { }
