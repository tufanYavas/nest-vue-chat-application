import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { StatusModule } from '../status/status.module';
import { RoomModule } from '../room/room.module';
import { MessageModule } from '../message/message.module';
import { ReportModule } from '../report/report.module';
import { EventsModule } from '../events/events.module';
import { WinstonLoggerModule } from '../logger/winston-logger.module';
import { SeederModule } from '../seeder/seeder.module';
import { PeerServerModule } from '../peer-server/peer-server.module';

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
					host: config.get('DB_HOST'),
					port: config.get('DB_PORT'),
					username: config.get('DB_USER'),
					password: config.get('DB_PASSWORD'),
					// entities: [__dirname + '/../**/*.entity.{js,ts}'],
					autoLoadEntities: true,
					database: config.get('DB_NAME'),
					synchronize: true,
				};
			},
		}),
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'client/dist'),
		}),
		UsersModule,
		AuthModule,
		StatusModule,
		RoomModule,
		MessageModule,
		ReportModule,
		EventsModule,
		WinstonLoggerModule,
		SeederModule,
		PeerServerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
