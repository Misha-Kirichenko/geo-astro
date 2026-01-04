import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { connections } from 'src/common/constants';
import { DatabaseService } from './database.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRootAsync({
    //   connectionName: connections.TG_BOT_USER.alias,
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const uri = configService.get<string>(
    //       connections.TG_BOT_USER.dbUrlName,
    //     );

    //     console.log('tg bot db uri', uri);
    //     return { uri };
    //   },
    // }),

    // MongooseModule.forRootAsync({
    //   connectionName: connections.DASHBOARD_USER.alias,
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const uri = configService.get<string>(
    //       connections.DASHBOARD_USER.dbUrlName,
    //     );
    //     console.log('dashboard user db uri', uri);
    //     return { uri };
    //   },
    // }),

    MongooseModule.forRootAsync({
      connectionName: connections.DB_MASTER.alias,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>(connections.DB_MASTER.dbUrlName);
        console.log('db master uri', uri);
        return { uri };
      },
    }),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      connections.DB_MASTER.alias,
    ),
  ],
  exports: [MongooseModule],
  providers: [DatabaseService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) { }

  async onModuleInit() {
    try {
      console.log('Creating root user if not exists...');
      await this.databaseService.createRootUser();
      console.log('Root user check complete.');
    } catch (e) {
      console.error('Error creating root user:', e);
    }
  }
}
