import {
	Body,
	Controller,
	Post,
	Get,
	NotAcceptableException,
	Session,
	UseGuards,
	Req,
	Res,
	HttpStatus,
	ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { LoginLogService } from '../login-log/login-log.service';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginGuestDto } from '../users/dtos/login-guest.dto';
import { LoginUserDto } from '../users/dtos/login-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { SettingsService } from '../settings/settings.service';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
		private readonly loginLogService: LoginLogService,
		private readonly settingsService: SettingsService,
	) {}

	@Get('/whoami')
	@UseGuards(AuthGuard)
	whoAmI(@Session() session: Request['session']) {
		return session.user;
	}

	@Post('/route')
	route(@Session() session: Request['session'], @Res() res: Response) {
		if (session.user && !session.user.banned) {
			res.status(HttpStatus.OK).send();
		} else {
			res.status(HttpStatus.BAD_REQUEST).send();
		}
	}

	@Post('/signout')
	signOut(@Session() session: Request['session'], @Res() res: Response) {
		session.user = null;
		res.clearCookie('session', { path: '/' });
		res.clearCookie('session.sig', { path: '/' });
		res.clearCookie('io', { path: '/' });
		res.send();
	}

	@Post('/signup')
	async createUser(@Body() body: CreateUserDto, @Session() session: Request['session'], @Req() req: Request) {
		const settings = await this.settingsService.getSettings();
		if (!settings.newMemberActive) {
			throw new ForbiddenException('New memberships are disabled.');
		}
		const user = await this.authService.signup(body.username, body.password, body.gender);

		await this.loginLogService.createLog(user, req);
		session.user = user;
		return user;
	}

	@Post('/guestLogin')
	async guestLogin(@Body() body: LoginGuestDto, @Session() session: Request['session'], @Req() req: Request) {
		const settings = await this.settingsService.getSettings();
		if (!settings.guestLoginActive) {
			throw new ForbiddenException('Guest login disabled.');
		}
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
	async signin(@Body() body: LoginUserDto, @Session() session: Request['session'], @Req() req: Request) {
		const user = await this.authService.signin(body.username, body.password);

		await this.loginLogService.createLog(user, req);
		session.user = user;
		return user;
	}
}
