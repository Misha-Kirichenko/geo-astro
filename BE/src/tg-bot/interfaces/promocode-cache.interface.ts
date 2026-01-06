export interface IPromocodeCache {
  readonly alias: string;
  readonly discountPercent: number;
  readonly expiresAt: string;
  readonly usageLimit: number;
}
