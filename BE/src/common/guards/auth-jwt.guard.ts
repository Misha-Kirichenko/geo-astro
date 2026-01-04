import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthorizedRequest, ITokenPayload } from 'src/common/interfaces';

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<IAuthorizedRequest>();

    const token = this.extractTokenFromHeader(req.headers, 'Bearer');

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<ITokenPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader = (
    headers: Record<string, string | string[] | undefined>,
    requestedType: string,
  ): string | undefined => {
    const authHeader = headers.authorization;

    if (typeof authHeader !== 'string') {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');

    return type === requestedType ? token : undefined;
  };
}
