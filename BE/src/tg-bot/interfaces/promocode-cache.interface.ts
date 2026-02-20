import { ServiceEnum } from 'src/common/enums';

export interface IPromocodeCache {
  readonly serviceSlug: ServiceEnum;
  readonly promocode: string;
  readonly discountPercent: number;
  readonly expiresAt: string;
  readonly usageLimit: number;
}
