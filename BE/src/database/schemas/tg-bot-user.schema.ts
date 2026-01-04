import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { LangEnum } from 'src/common/enums';

export type TgBotUserDocument = HydratedDocument<TgBotUser>;

@Schema({ versionKey: false, timestamps: false })
export class TgBotUser {
  @Prop({ required: true, unique: true, type: MongooseSchema.Types.Number })
  tgId: number;

  @Prop({ type: MongooseSchema.Types.String })
  firstName: string;

  @Prop({ type: MongooseSchema.Types.String, required: false })
  lastName?: string;

  @Prop({
    unique: true,
    required: true,
    type: MongooseSchema.Types.String,
  })
  userName: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
    enum: Object.values(LangEnum),
  })
  lang: LangEnum;

  @Prop({ type: MongooseSchema.Types.Number })
  createdAt: number;

  @Prop({ type: MongooseSchema.Types.Number })
  updatedAt: number;
}

export const TgBotUserSchema = SchemaFactory.createForClass(TgBotUser);

TgBotUserSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'updateMany'],
  function () {
    this.set({ updatedAt: Date.now() });
  },
);
