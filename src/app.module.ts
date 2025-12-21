import { Module } from '@nestjs/common';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PromocodeModule } from './promocode/promocode.module';

@Module({
  imports: [TgBotModule, AuthModule, DatabaseModule, PromocodeModule],
})
export class AppModule {}
