import { BadRequestException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const hashPassword = async (password: string): Promise<string> => {
	// Generate a salt
	const salt = randomBytes(8).toString('hex');

	// Hash the salt and the password together
	const hash = (await scrypt(password, salt, 32)) as Buffer;

	// Join the hashed result and the salt together
	return salt + '.' + hash.toString('hex');
};

export const comparePasswords = async (hashedPassword: string, password: string): Promise<boolean> => {
	const [salt, storedHash] = hashedPassword.split('.');
	const hash = (await scrypt(password, salt, 32)) as Buffer;
	if (storedHash !== hash.toString('hex')) {
		throw new BadRequestException('Bad password');
	}
	return true;
};
