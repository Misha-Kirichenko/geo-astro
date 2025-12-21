import { Module } from '@nestjs/common';
import { TgBotMenuHandler, TgBotServicesHandler } from './handlers';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import {
  TgBotLocalizationService,
  TgBotPromocodeService,
  TgBotUserService,
  TgBotPromocodeCacheService,
  TgBotServiceFormService,
} from './services';
import { session } from 'telegraf';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TgBotUser,
  TgBotUserSchema,
} from 'src/common/schemas/tg-bot-user.schema';
import { connections } from 'src/common/constants';
import { DatabaseModule } from 'src/database/database.module';
import {
  Promocode,
  PromocodeSchema,
} from 'src/common/schemas/promocode.schema';
import {
  PromocodeUsage,
  PromocodeUsageSchema,
} from 'src/common/schemas/promocode-usage.schema';

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
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const token = configService.get<string>('TG_BOT_TOKEN');
        if (!token) {
          throw new Error('TG_BOT_TOKEN is not defined in .env');
        }
        return { token, middlewares: [session()] };
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
  ],
  exports: [MongooseModule],
})
export class TgBotModule { }
