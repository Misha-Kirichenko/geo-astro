import { ServiceEnum } from '../enums';

export interface IServiceItem {
  readonly name: string;
  readonly description: string;
  readonly slug: ServiceEnum;
  readonly price: number;
}
