import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';
import { connections } from 'src/common/constants';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import type { Response as ExpressResponse, Request } from 'express';
import { IAuthorizedRequest } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, connections.DB_MASTER.alias)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) { }

  public async login(
    login: string,
    password: string,
    res: ExpressResponse,
  ): Promise<{ accessToken: string }> {
    if (!login || !password) {
      throw new UnauthorizedException();
    }
    const foundUser = await this.userModel.findOne({ login });

    if (!foundUser) {
      throw new UnauthorizedException();
    }

    const passwordsMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException();
    }

    const tokenPayload = {
      login: foundUser.login,
      lastLogin: foundUser.lastLogin,
      role: foundUser.role,
    };

    const accessToken = await this.jwtService.signAsync<Record<string, any>>(
      tokenPayload,
      {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRE_TIME),
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );

    const refreshToken = await this.jwtService.signAsync<Record<string, any>>(
      tokenPayload,
      {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRE_TIME),
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );

    foundUser.lastLogin = Date.now();
    await foundUser.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      sameSite: 'strict',
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRE_TIME) * 1000,
      path: '/',
    });

    return { accessToken };
  }

  public async refresh(
    req: IAuthorizedRequest,
  ): Promise<{ accessToken: string }> {
    const tokenPayload = {
      login: req.user.login,
      lastLogin: req.user.lastLogin,
      role: req.user.role,
    };

    const accessToken = await this.jwtService.signAsync<Record<string, any>>(
      tokenPayload,
      {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRE_TIME),
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );

    return { accessToken };
  }

  public logout(res: ExpressResponse) {
    res.clearCookie('refreshToken', {
      path: '/',
    });
  }
}
