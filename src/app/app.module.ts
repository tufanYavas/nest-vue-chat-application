import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Permission } from '../users/entities/permission.entity';
import { Preference } from '../users/entities/preference.entity';
import { UsersModule } from '../users/users.module';
import { LoginLog } from '../loginlog/loginlog.entity';
import { AuthModule } from '../auth/auth.module';
import { Status } from 'src/status/entities/status.entity';
import { StatusModule } from 'src/status/status.module';
import { RoomModule } from 'src/room/room.module';
import { MessageModule } from 'src/message/message.module';
import { ReportModule } from 'src/report/report.module';

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
					entities: [User, Permission, Preference, LoginLog, Status],
					autoLoadEntities: true,
				};
			},
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client/dist'),
		}),
		UsersModule,
		AuthModule,
		StatusModule,
		RoomModule,
		MessageModule,
		ReportModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
