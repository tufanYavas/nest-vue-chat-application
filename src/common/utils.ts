import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

export function getOrigins(configService: ConfigService, type: string) {
	const origins = configService.get<string>(type);
	const originsArray = origins.split(',');
	return originsArray;
}

export function getFileInterceptor(
	destination: string,
	fileTypeRegex: RegExp = /\.(jpg|jpeg|png|gif)$/,
	fileTypeErrorMessage: string = 'Only image files are allowed!',
) {
	return FileInterceptor('file', {
		storage: diskStorage({
			destination,
			filename: (req, file, cb) => {
				const randomName = Array(32)
					.fill(null)
					.map(() => Math.round(Math.random() * 16).toString(16))
					.join('');
				return cb(null, `${randomName}${extname(file.originalname)}`);
			},
		}),
		fileFilter: (req, file, cb) => {
			if (!file.originalname.match(fileTypeRegex)) {
				return cb(new HttpException(fileTypeErrorMessage, HttpStatus.BAD_REQUEST), false);
			}
			cb(null, true);
		},
	});
}
