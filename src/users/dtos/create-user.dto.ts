import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
	@MinLength(3, { message: 'Username must be at least 3 characters long.' })
	@MaxLength(18, { message: 'Username can be at most 18 characters long.' })
	username: string;

	@MinLength(6, { message: 'Password must be at least 6 characters long.' })
	@MaxLength(18, { message: 'Password can be at most 18 characters long.' })
	@IsString({ message: 'Password must be a valid string.' })
	password: string;

	@IsBoolean({ message: 'Wrong gender format.' })
	gender: boolean;
}
