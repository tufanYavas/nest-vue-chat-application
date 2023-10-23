import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from '../../users/dtos/user.dto';
import { Expose, Type } from 'class-transformer';
import { RoomDto } from 'src/room/dto/room.dto';

export class SocketUserDto extends PartialType(UserDto) {
	@Expose()
	clientId: string;

	@Expose()
	@Type(() => RoomDto)
	room: RoomDto;
}
