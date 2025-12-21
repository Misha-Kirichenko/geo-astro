import { Request } from 'express';
import { ITokenPayload } from './token-payload.interface';

export interface IAuthorizedRequest extends Request {
  readonly cookies: {
    refreshToken: string;
  };
  user: ITokenPayload;
}
