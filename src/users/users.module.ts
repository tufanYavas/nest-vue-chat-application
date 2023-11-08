import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Preference } from '../users/entities/preference.entity';
import { Permission } from '../users/entities/permission.entity';
import { LoginlogModule } from '../login-log/login-log.module';
import { RankModule } from '../rank/rank.module';
import { StatusModule } from '../status/status.module';
import { EventsModule } from '../events/events.module';

@Module({
	providers: [
		UsersService,
		{
			provide: APP_INTERCEPTOR,
			useClass: CurrentUserInterceptor,
		},
	],
	imports: [
		TypeOrmModule.forFeature([User, Preference, Permission]),
		LoginlogModule,
		RankModule,
		StatusModule,
		forwardRef(() => EventsModule),
	],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
