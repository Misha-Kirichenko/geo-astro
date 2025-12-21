import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ServiceEnum } from '../enums';

export type PromocodeUsageDocument = HydratedDocument<PromocodeUsage>;

@Schema({ versionKey: false, timestamps: false })
export class PromocodeUsage {
  @Prop({ required: true, type: MongooseSchema.Types.Number })
  tgId: number;

  @Prop({ required: true, type: MongooseSchema.Types.String })
  promocode: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
    enum: Object.values(ServiceEnum),
  })
  serviceSlug: ServiceEnum;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
    default: () => Date.now(),
  })
  usedAt: number;
}

export const PromocodeUsageSchema =
  SchemaFactory.createForClass(PromocodeUsage);

PromocodeUsageSchema.index({ tgId: 1, promocode: 1 }, { unique: true });
