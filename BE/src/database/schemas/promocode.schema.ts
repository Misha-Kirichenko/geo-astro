import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PromocodeDocument = HydratedDocument<Promocode>;

@Schema({ versionKey: false, timestamps: false })
export class Promocode {
  @Prop({ required: true, type: MongooseSchema.Types.Number })
  providerTgId: number;

  @Prop({
    required: true,
    unique: true,
    minlength: 9,
    maxLength: 10,
    type: MongooseSchema.Types.String,
  })
  alias: string;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 1,
    min: 1,
    required: true,
  })
  usageLimit: number;

  @Prop({ type: MongooseSchema.Types.Number, required: true, min: 1, max: 99 })
  discountPercent: number;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    default: () => new Date().toISOString().substring(0, 10),
  })
  issuedAt: string;

  @Prop({ type: MongooseSchema.Types.String, required: true })
  expiresAt: string;
}

export const PromocodeSchema = SchemaFactory.createForClass(Promocode);
