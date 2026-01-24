import { IServiceItem } from 'src/common/interfaces';
import { Context } from 'telegraf';

export interface IKeyboardWithPriceParams {
  readonly ctx: Context;
  readonly service: IServiceItem;
  readonly formDataStage?: number;
  readonly discountPercent?: number;
}
