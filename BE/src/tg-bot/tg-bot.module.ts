import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { session } from 'telegraf';
import { ModuleRef } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TgBotMenuHandler,
  TgBotServicesHandler,
  TgBotPaymentsMenuHandler,
} from './handlers';
import {
  TgBotLocalizationService,
  TgBotPromocodeService,
  TgBotUserService,
  TgBotPromocodeCacheService,
  TgBotServiceFormService,
  TgBotPaymentsMenuService,
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
import { TgBotFormCacheService } from './services/tg-bot-service-form-cache.service';

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

        return {
          token,
          middlewares: [session(), langMiddleware.getMiddleware()],
        };
      },
    }),
  ],
  providers: [
    LangMiddleware,
    TgBotMenuHandler,
    TgBotLocalizationService,
    TgBotUserService,
    TgBotPromocodeService,
    TgBotPromocodeCacheService,
    TgBotServicesHandler,
    TgBotFormCacheService,
    TgBotServiceFormService,
    TgBotPaymentsMenuService,
    TgBotPaymentsMenuHandler,
  ],
  exports: [MongooseModule],
})
export class TgBotModule {}
