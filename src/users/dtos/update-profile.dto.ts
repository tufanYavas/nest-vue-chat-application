import { PreferenceDto } from './preference.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto extends PreferenceDto {
	@IsOptional()
	@MinLength(6, { message: 'Password must be at least 6 characters long.' })
	@MaxLength(18, { message: 'Password can be at most 18 characters long.' })
	@IsString({ message: 'Password must be a valid string.' })
	oldPassword?: string;

	@IsOptional()
	@MinLength(6, { message: 'New password must be at least 6 characters long.' })
	@MaxLength(18, { message: 'New password can be at most 18 characters long.' })
	@IsString({ message: 'New password must be a valid string.' })
	newPassword?: string;

	@IsOptional()
	@MaxLength(250, { message: 'About can be at most 250 characters long.' })
	@IsString({ message: 'About must be a valid string.' })
	about?: string;
}
