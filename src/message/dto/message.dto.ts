import { Expose, Type } from 'class-transformer';
import { RoomDto } from 'src/room/dto/room.dto';
import { UserDto } from 'src/users/dtos/user.dto';

export class MessageDto {
	@Expose()
	id: number;

	@Expose()
	created: Date;

	@Expose()
	content: string;

	@Expose()
	@Type(() => UserDto)
	sender: UserDto;

	@Expose()
	@Type(() => RoomDto)
	room: RoomDto;
}
