interface IPromocodeProvider {
  readonly tgId: number;
  readonly firstName: string;
  readonly lastName?: string;
  readonly userName: string;
}

export interface IPromocode {
  readonly alias: string;
  discountPercent: number;
  readonly issuedAt: string;
  expiresAt: string;
}

export interface IPromocodeWithProvider extends IPromocode {
  readonly provider: IPromocodeProvider | null;
}
