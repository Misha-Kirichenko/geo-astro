import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import { LangEnum } from 'src/common/enums';
import { ITGUserPayload } from './interfaces';
import { NON_SUPPORTED_LANG_MESSAGE } from 'src/tg-bot/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }
  /*todo: 
      1. write user caching logic
    */
  public async saveUser(
    userData: ITGUserPayload,
    defaultUserLang: LangEnum,
  ): Promise<void> {
    if (!Object.values(LangEnum).includes(userData.lang as LangEnum)) {
      const errorLang = userData.lang || defaultUserLang;
      const errMessage =
        NON_SUPPORTED_LANG_MESSAGE[
        errorLang as keyof typeof NON_SUPPORTED_LANG_MESSAGE
        ];
      throw new Error(errMessage);
    }
    await this.userModel.findOneAndUpdate({ tgId: userData.tgId }, userData, {
      upsert: true,
      new: true,
    });
  }

  public async findByTgId(tgId: number): Promise<ITGUserPayload | null> {
    const foundUser = await this.userModel.findOne({ tgId }).lean();
    return foundUser;
  }
}
