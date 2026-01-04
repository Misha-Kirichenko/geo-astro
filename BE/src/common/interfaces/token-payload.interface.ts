import { UserRoleEnum } from '../enums';

export interface ITokenPayload {
  readonly login: string;
  readonly lastLogin: number;
  readonly role: UserRoleEnum;
}
