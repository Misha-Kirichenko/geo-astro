import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response as ExpressResponse } from 'express';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import type { IAuthorizedRequest } from 'src/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  login(
    @Body() loginDto: { login: string; password: string },
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ accessToken: string }> {
    const { login, password } = loginDto || {};
    return this.authService.login(login, password, res);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('/refresh')
  refresh(@Req() req: IAuthorizedRequest): Promise<{ accessToken: string }> {
    return this.authService.refresh(req);
  }
}
