import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
	@IsString({ message: 'Content should be a string.' })
	@MaxLength(300, { message: 'Content can be at most 300 characters long.' })
	content: string;

	@IsInt({ message: 'Room should be a integer.' })
	room: number;
}
