import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const token = configService.get<string>('TG_BOT_TOKEN');
        if (!token) {
          throw new Error('TG_BOT_TOKEN is not defined in .env');
        }
        return { token };
      },
    }),
  ],
  providers: [TgBotService],
})
export class TgBotModule { }
