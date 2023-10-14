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
import { LoginLogService } from 'src/loginlog/loginlog.service';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginVisitorDto } from 'src/users/dtos/login-visitor.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

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
	signOut(@Session() session: Express.Request['session']) {
		console.log(session.user);
		session.user = null;
	}

	@Post('/signup')
	async createUser(
		@Body() body: CreateUserDto,
		@Session() session: Express.Request['session'],
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

	@Post('/visitorLogin')
	async visitorLogin(
		@Body() body: LoginVisitorDto,
		@Session() session: Express.Request['session'],
		@Req() req: Request,
	) {
		const matchUser = await this.usersService.findOneBy({
			username: body.username,
		});
		if (matchUser) {
			throw new NotAcceptableException('Username is already in use');
		}
		const user = new User();
		user.username = body.username;
		user.id = -1;
		user.gender = body.gender;
		session.user = user;

		await this.loginLogService.createLog(user, req);

		return user;
	}

	@Post('/signin')
	async signin(
		@Body() body: LoginUserDto,
		@Session() session: Express.Request['session'],
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
