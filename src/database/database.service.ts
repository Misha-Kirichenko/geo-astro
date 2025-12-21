import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { connections } from 'src/common/constants';
import { User, UserDocument } from 'src/common/schemas/user.schema';
import { UserRoleEnum } from 'src/common/enums';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(User.name, connections.DB_MASTER.alias)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async createRootUser() {
    const rootLogin = 'root';
    const rootPassword = process.env.ROOT_DEFAULT_PASSWORD as string;
    await this.userModel.updateOne(
      { login: rootLogin },
      {
        $setOnInsert: {
          login: rootLogin,
          password: await bcrypt.hash(
            rootPassword,
            Number(process.env.PASSWORD_SALT_ROUNDS),
          ),
          role: UserRoleEnum.ROOT,
        },
      },
      { upsert: true },
    );
  }
}
