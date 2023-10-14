import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Preference } from 'src/users/entities/preference.entity';
import { Permission } from 'src/users/entities/permission.entity';
import { LoginlogModule } from 'src/loginlog/loginlog.module';
import { RankModule } from 'src/rank/rank.module';

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
	],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
