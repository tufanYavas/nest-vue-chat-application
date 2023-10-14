import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateStatusDto {
	@IsString({ message: 'Name should be a string.' })
	@MinLength(1, { message: 'Name must be at least 1 characters long.' })
	@MaxLength(18, { message: 'Name can be at most 18 characters long.' })
	name: string;
}
