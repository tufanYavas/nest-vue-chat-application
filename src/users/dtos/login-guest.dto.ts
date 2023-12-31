import { IsBoolean, MaxLength, MinLength } from 'class-validator';

export class LoginGuestDto {
	@MinLength(3, { message: 'Username must be at least 3 characters long.' })
	@MaxLength(18, { message: 'Username can be at most 18 characters long.' })
	username: string;

	@IsBoolean({ message: 'Wrong gender format.' })
	gender: boolean;
}
