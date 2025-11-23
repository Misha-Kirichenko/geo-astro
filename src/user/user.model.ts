import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { LangEnum } from 'src/common/enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, unique: true, type: MongooseSchema.Types.Number })
  tgId!: number;

  @Prop({ type: MongooseSchema.Types.String })
  firstName!: string;

  @Prop({ type: MongooseSchema.Types.String, required: false })
  lastName?: string;

  @Prop({ required: true, unique: true })
  userName!: string;

  @Prop({ required: true, enum: Object.values(LangEnum) })
  lang!: LangEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
