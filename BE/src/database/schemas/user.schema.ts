import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { UserRoleEnum } from '../../common/enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: false })
export class User {
  @Prop({ type: MongooseSchema.Types.String, unique: true, required: true })
  login: string;

  @Prop({ type: MongooseSchema.Types.String, required: false })
  firstName: string;

  @Prop({ type: MongooseSchema.Types.String, required: false })
  lastName?: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  password: string;

  @Prop({ type: MongooseSchema.Types.Number, required: true, default: 0 })
  lastLogin: number;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
    enum: Object.values(UserRoleEnum),
  })
  role: UserRoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
