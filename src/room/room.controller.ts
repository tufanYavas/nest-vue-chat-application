import { Controller, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';

@Serialize(RoomDto)
@Controller('room')
export class RoomController {
	constructor(private readonly roomsService: RoomService) {}

	@Get()
	findAll() {
		return this.roomsService.findAll();
	}
}
