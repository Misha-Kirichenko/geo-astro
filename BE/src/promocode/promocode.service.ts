import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { connections, MESSAGES } from 'src/common/constants';
import {
  Promocode,
  PromocodeDocument,
} from 'src/database/schemas/promocode.schema';
import { GeneratePromocodeDTO } from './dto/generate-promocode.dto';
import {
  TgBotUser,
  TgBotUserDocument,
} from 'src/database/schemas/tg-bot-user.schema';
import { messageUtil } from 'src/utils';
import {
  IPromocode,
  IPromocodeWithProvider,
} from './interfaces/promocode.interface';

@Injectable()
export class PromocodeService {
  constructor(
    @InjectModel(Promocode.name, connections.DB_MASTER.alias)
    private readonly promocodeModel: Model<PromocodeDocument>,
    @InjectModel(TgBotUser.name, connections.DB_MASTER.alias)
    private readonly tgBotUser: Model<TgBotUserDocument>,
  ) {}

  public async generatePromocode(
    tgId: number,
    promocodeDTO: GeneratePromocodeDTO,
  ): Promise<IPromocode> {
    try {
      const { discountPercent } = promocodeDTO;

      const user = await this.tgBotUser.findOne({ tgId }, 'firstName lastName');

      if (!user) {
        throw new NotFoundException('User was not found');
      }

      const randomString = Math.random().toString(36).substring(2, 6);

      const alias =
        `${user.firstName.substring(0, 2).padStart(2, user.firstName[0])}${discountPercent}${user.lastName ? user.lastName.substring(0, 2).padStart(2, user.lastName[0]) : user.firstName[0]}${randomString}`.toUpperCase();

      const newPromocode = await this.promocodeModel.create({
        ...promocodeDTO,
        providerTgId: tgId,
        alias,
      });

      const promocodePlain = newPromocode.toObject();

      return {
        alias: promocodePlain.alias,
        discountPercent: promocodePlain.discountPercent,
        issuedAt: promocodePlain.issuedAt,
        expiresAt: promocodePlain.expiresAt,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(MESSAGES.ERRORS.BAD_REQUEST);
    }
  }

  public async getPromocode(alias: string): Promise<IPromocodeWithProvider> {
    const promocode = await this.promocodeModel.findOne({ alias });

    if (!promocode) {
      throw new NotFoundException(messageUtil.ERRORS.notFound('Promocode'));
    }

    const promocodePlain = promocode.toObject();

    const user = await this.tgBotUser.findOne(
      { tgId: promocodePlain.providerTgId },
      'tgId firstName lastName userName',
    );

    const provider = user
      ? {
          tgId: user.tgId,
          firstName: user.firstName,
          ...(user.lastName && { lastName: user.lastName }),
          userName: user.userName,
        }
      : null;

    return {
      alias: promocodePlain.alias,
      discountPercent: promocodePlain.discountPercent,
      issuedAt: promocodePlain.issuedAt,
      expiresAt: promocodePlain.expiresAt,
      provider,
    };
  }
}
