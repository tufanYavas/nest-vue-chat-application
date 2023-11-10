import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRoomRowDto } from './dto/update-room-row';
import { EventsGateway } from '../events/events.gateway';
import { plainToClass } from 'class-transformer';
import { RoomDto } from './dto/room.dto';
import { IRoom } from '../common/server.interfaces';

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(Room)
		private readonly roomRepository: Repository<Room>,
		@Inject(forwardRef(() => EventsGateway))
		private readonly eventsGateway: EventsGateway,
	) {}

	async saveRoom(room: Room) {
		const r = await this.roomRepository.save(room);
		if (this.eventsGateway.server) this.roomUpdated(r);
	}
	roomUpdated(room: Room) {
		this.eventsGateway.roomUpdated(this.roomToIRoom(room));
	}

	roomToIRoom(room: Room) {
		return plainToClass(RoomDto, room, { excludeExtraneousValues: true }) as IRoom;
	}

	async updateRoomRow(id: number, updateRoomRowDto: UpdateRoomRowDto) {
		const room = await this.findOne(id);
		if (!room) {
			throw new NotFoundException('Room not found');
		}
		room.row = updateRoomRowDto.row;
		return await this.saveRoom(room);
	}

	async makeDefaultRoom(id: number) {
		const room = await this.roomRepository.findOneBy({ id });
		if (!room) {
			throw new NotFoundException('Room not found');
		}
		await this.roomRepository.update({ default: true }, { default: false });
		room.default = true;
		return await this.saveRoom(room);
	}

	async getDefaultRoom() {
		const room = await this.roomRepository.findOneBy({ default: true });
		if (room) {
			room.hasPassword = room.password ? true : false;
		}
		return room;
	}

	async create(createRoomDto: CreateRoomDto) {
		const room = this.roomRepository.create(createRoomDto);
		if (createRoomDto.default) {
			this.roomRepository.update({ default: true }, { default: false });
		}
		return await this.saveRoom(room);
	}

	async findAll() {
		const rooms = await this.roomRepository.find({});
		for (const room of rooms) {
			room.hasPassword = room.password ? true : false;
		}
		return rooms;
	}

	async findOne(id: number) {
		const room = await this.roomRepository.findOneBy({ id });
		if (room) {
			room.hasPassword = room.password ? true : false;
		}
		return room;
	}

	async update(id: number, updateRoomDto: UpdateRoomDto) {
		const existingRoom = await this.findOne(id);
		if (!existingRoom) {
			throw new NotFoundException('Room not found');
		}

		if (updateRoomDto.default) {
			this.roomRepository.update({ default: true }, { default: false });
		}
		return this.roomRepository.update(id, updateRoomDto);
	}

	async remove(id: number) {
		await this.roomRepository.delete(id);
		const defaultRoom = this.getDefaultRoom();
		if (!defaultRoom) {
			const room = await this.roomRepository.findOne({});
			room.default = true;
			await this.saveRoom(room);
		}

		this.roomUpdated({ id } as Room);
	}
}
