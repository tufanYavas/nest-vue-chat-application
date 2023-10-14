import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRankDto {
	@IsInt({ message: 'Rank must be a number' })
	value: number;

	@IsString({ message: 'Name should be a string.' })
	@MinLength(1, { message: 'Name must be at least 1 characters long.' })
	@MaxLength(18, { message: 'Name can be at most 18 characters long.' })
	name: string;
}
