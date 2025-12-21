import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthorizedRequest, ITokenPayload } from 'src/common/interfaces';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<IAuthorizedRequest>();

    const token = req.cookies?.refreshToken;

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<ITokenPayload>(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
