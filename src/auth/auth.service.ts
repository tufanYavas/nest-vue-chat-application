import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { parse } from 'cookie';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async isValidSession(cookies: string): Promise<boolean> {
		if (!cookies) return false;
		const { session } = parse(cookies);
		if (!session) return false;

		const decodedSession = Buffer.from(session, 'base64').toString('utf8');
		const parsedSession = JSON.parse(decodedSession);

		if (!parsedSession.user) return false;

		const user = await this.usersService.findOne(parsedSession.user.id);
		if (!user || user.banned) return false;

		return true;
	}

	async signup(username: string, password: string, gender: boolean) {
		// See if email is in use
		const users = await this.usersService.find(username);
		if (users.length) {
			throw new BadRequestException('Username in use');
		}

		// Hash the users password
		// Generate a salt
		const salt = randomBytes(8).toString('hex');

		// Hash the salt and the password together
		const hash = (await scrypt(password, salt, 32)) as Buffer;

		// Join the hashed result and the salt together
		const result = salt + '.' + hash.toString('hex');

		// Create a new user and save it
		const user = await this.usersService.create({
			username: username,
			password: result,
			gender: gender,
		});

		// return the user
		return user;
	}

	async signin(username: string, password: string) {
		const [user] = await this.usersService.find(username);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const [salt, storedHash] = user.password.split('.');

		const hash = (await scrypt(password, salt, 32)) as Buffer;

		if (storedHash !== hash.toString('hex')) {
			throw new BadRequestException('Bad password');
		}

		return user;
	}
}
