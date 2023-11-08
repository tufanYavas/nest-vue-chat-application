import { Injectable, BadRequestException, NotFoundException, Inject, LoggerService, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { parse } from 'cookie';
import { User } from '../users/entities/user.entity';
import { comparePasswords } from '../utils';

@Injectable()
export class AuthService {
	constructor(
		@Inject('LoggerService') private readonly logger: LoggerService,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
	) {}

	async validateUserFromCookies(cookies: string): Promise<User> {
		if (!cookies) return null;
		const { session } = parse(cookies);
		if (!session) return null;

		const decodedSession = Buffer.from(session, 'base64').toString('utf8');
		const parsedSession = JSON.parse(decodedSession);

		if (!parsedSession.user) return null;

		const user = await this.usersService.findOneWithAllRelations({ id: parsedSession.user.id });
		if (!user || user.banned) return null;

		return user;
	}

	async signup(username: string, password: string, gender: boolean) {
		const users = await this.usersService.find(username);
		if (users.length) {
			throw new BadRequestException('Username in use');
		}

		const user = await this.usersService.create({
			username,
			password,
			gender,
		});

		this.logger.log(`User created: ${user.id}`);
		return await this.usersService.findWithAllRelations({ username });
	}

	async signin(username: string, password: string) {
		const user = await this.usersService.findWithAllRelations({ username });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const isMatch = await comparePasswords(user.password, password);

		if (isMatch) return user;
	}
}
