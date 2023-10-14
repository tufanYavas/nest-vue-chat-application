import {
	IsBoolean,
	IsInt,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateRoomDto {
	@IsInt({ message: 'Value must be a number' })
	row: number;

	@IsString({ message: 'Name should be a string.' })
	@MinLength(1, { message: 'Name must be at least 1 characters long.' })
	@MaxLength(18, { message: 'Name can be at most 18 characters long.' })
	name: string;

	@IsOptional()
	@IsString({ message: 'Slogan should be a string.' })
	@MaxLength(30, { message: 'Slogan can be at most 30 characters long.' })
	slogan: string;

	@IsBoolean({ message: 'Active should be a boolean.' })
	active: boolean;

	@IsBoolean({ message: 'Default should be a boolean.' })
	default: boolean;

	@IsOptional()
	@IsString({ message: 'BG should be a string.' })
	bg: string;

	@IsOptional()
	@IsString({ message: 'Password should be a string.' })
	password: string;
}
