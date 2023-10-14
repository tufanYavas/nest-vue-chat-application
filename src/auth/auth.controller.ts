import {
	Body,
	Controller,
	Post,
	Get,
	NotAcceptableException,
	Session,
	UseGuards,
	Req,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { LoginLogService } from '../loginlog/loginlog.service';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginGuestDto } from '../users/dtos/login-guest.dto';
import { LoginUserDto } from '../users/dtos/login-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../users/entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Express {
	export interface Request {
		session?: {
			user?: User;
			[key: string]: any;
		};
	}
}

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
		private readonly loginLogService: LoginLogService,
	) {}

	@Get('/whoami')
	@UseGuards(AuthGuard)
	whoAmI(@Session() session) {
		return session.user;
	}

	@Post('/signout')
	signOut(@Session() session: Request['session']) {
		console.log(session.user);
		session.user = null;
	}

	@Post('/signup')
	async createUser(
		@Body() body: CreateUserDto,
		@Session() session: Request['session'],
		@Req() req: Request,
	) {
		const user = await this.authService.signup(
			body.username,
			body.password,
			body.gender,
		);

		await this.loginLogService.createLog(user, req);
		session.user = user;
		return user;
	}

	@Post('/guestLogin')
	async guestLogin(
		@Body() body: LoginGuestDto,
		@Session() session: Request['session'],
		@Req() req: Request,
	) {
		const matchUser = await this.usersService.findOneBy({
			username: body.username,
		});
		if (matchUser) {
			throw new NotAcceptableException('Username is already in use');
		}
		const user = await this.usersService.createUserDontSave({
			username: body.username,
			id: -1,
			gender: body.gender,
		});
		session.user = user;

		await this.loginLogService.createLog(user, req);

		return user;
	}

	@Post('/signin')
	async signin(
		@Body() body: LoginUserDto,
		@Session() session: Request['session'],
		@Req() req: Request,
	) {
		const user = await this.authService.signin(
			body.username,
			body.password,
		);

		await this.loginLogService.createLog(user, req);
		session.user = user;
		return user;
	}
}
