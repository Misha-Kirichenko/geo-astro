import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../common/schemas/user.schema';
import { connections } from 'src/common/constants';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      connections.DB_MASTER.alias,
    ),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule { }
