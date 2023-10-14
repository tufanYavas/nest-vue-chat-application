import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
	@MinLength(3, { message: 'Username must be at least 3 characters long.' })
	@MaxLength(18, { message: 'Username can be at most 13 characters long.' })
	username: string;

	@MinLength(6, { message: 'Password must be at least 6 characters long.' })
	@MaxLength(13, { message: 'Password can be at most 13 characters long.' })
	@IsString({ message: 'Password must be a valid string.' })
	password: string;
}
