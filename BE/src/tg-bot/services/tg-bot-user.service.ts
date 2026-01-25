import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LangEnum } from 'src/common/enums';
import {
  TgBotUser,
  TgBotUserDocument,
} from 'src/database/schemas/tg-bot-user.schema';
import { ITGUserPayload } from '../interfaces';
import { NON_SUPPORTED_LANG_MESSAGE } from '../constants';
import { connections } from 'src/common/constants';

@Injectable()
export class TgBotUserService {
  constructor(
    @InjectModel(TgBotUser.name, connections.DB_MASTER.alias)
    private readonly tgBotUserModel: Model<TgBotUserDocument>,
  ) {}
  /*todo: 
          1. write user caching logic
        */
  public async saveUser(userData: ITGUserPayload): Promise<void> {
    if (!Object.values(LangEnum).includes(userData.lang as LangEnum)) {
      const errorLang = userData.lang;
      const errMessage =
        NON_SUPPORTED_LANG_MESSAGE[
        errorLang as keyof typeof NON_SUPPORTED_LANG_MESSAGE
        ];
      throw new Error(errMessage);
    }

    await this.tgBotUserModel.findOneAndUpdate(
      { tgId: userData.tgId },
      {
        $set: userData,
        $setOnInsert: { createdAt: Date.now() },
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  public async findByTgId(tgId: number): Promise<ITGUserPayload | null> {
    const foundUser = await this.tgBotUserModel.findOne({ tgId }).lean();
    return foundUser;
  }
}
