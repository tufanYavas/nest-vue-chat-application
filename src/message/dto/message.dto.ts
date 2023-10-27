import { Expose, Type } from 'class-transformer';
import { RoomDto } from '../../room/dto/room.dto';
import { UserDto } from '../../users/dtos/user.dto';

export class MessageDto {
	@Expose()
	id: number;

	@Expose()
	created: Date;

	@Expose()
	content: string;

	@Expose()
	imagePath: string; // chat image path

	@Expose()
	@Type(() => UserDto)
	sender: UserDto;

	@Expose()
	@Type(() => RoomDto)
	room: RoomDto;
}
