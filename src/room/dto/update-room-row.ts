import { IsInt } from 'class-validator';

export class UpdateRoomRowDto {
	@IsInt({ message: 'Value must be a number' })
	row: number;
}
