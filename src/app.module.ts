import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Permission } from './users/permission.entity';
import { Preference } from './users/preference.entity';
import { UsersModule } from './users/users.module';
import { LoginLog } from './loginlog/loginlog.entity';
import { LoginlogService } from './loginlog/loginlog.service';
import { LoginlogModule } from './loginlog/loginlog.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Permission, Preference, LoginLog],
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
    UsersModule,
    LoginlogModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoginlogService],
})
export class AppModule {}
