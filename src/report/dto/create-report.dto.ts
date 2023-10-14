import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateReportDto {
	@IsString({ message: 'Content should be a string.' })
	@MaxLength(500, { message: 'Content can be at most 300 characters long.' })
	message: string;

	@IsInt({ message: 'Reported User should be a integer.' })
	reportedUser: number;
}
