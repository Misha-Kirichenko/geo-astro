import { Module } from '@nestjs/common';
import { PromocodeController } from './promocode.controller';
import { PromocodeService } from './promocode.service';
import { DatabaseModule } from 'src/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { connections } from 'src/common/constants';
import {
  Promocode,
  PromocodeSchema,
} from 'src/common/schemas/promocode.schema';
import { JwtService } from '@nestjs/jwt';
import {
  TgBotUser,
  TgBotUserSchema,
} from 'src/common/schemas/tg-bot-user.schema';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature(
      [
        { name: TgBotUser.name, schema: TgBotUserSchema },
        { name: Promocode.name, schema: PromocodeSchema },
      ],
      connections.DB_MASTER.alias,
    ),
  ],
  controllers: [PromocodeController],
  providers: [PromocodeService, JwtService],
})
export class PromocodeModule { }
