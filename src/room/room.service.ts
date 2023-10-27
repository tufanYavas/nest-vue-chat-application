import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(Room)
		private readonly roomRepository: Repository<Room>,
	) {}

	async getDefaultRoom() {
		const room = await this.roomRepository.findOneBy({ default: true });
		if (room) {
			room.hasPassword = room.password ? true : false;
		}
		return room;
	}

	create(createRoomDto: CreateRoomDto) {
		const room = this.roomRepository.create(createRoomDto);
		if (createRoomDto.default) {
			this.roomRepository.update({ default: true }, { default: false });
		}
		return this.roomRepository.save(room);
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

	remove(id: number) {
		return this.roomRepository.delete(id);
	}
}
