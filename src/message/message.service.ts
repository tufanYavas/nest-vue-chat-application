import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomService } from 'src/room/room.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		private readonly roomService: RoomService,
	) {}

	async create(sender: User, createMessageDto: CreateMessageDto) {
		const room = await this.roomService.findOne(createMessageDto.room);
		if (!room) {
			throw new NotFoundException('Room not found');
		}
		if (!sender) {
			throw new NotFoundException('Sender not found');
		}

		const message = this.messageRepository.create({
			content: createMessageDto.content,
			sender: sender,
			room: room,
		});
		return this.messageRepository.save(message);
	}

	findAll() {
		return this.messageRepository.find({ relations: ['sender', 'room'] });
	}

	findOne(id: number) {
		return this.messageRepository.findOneBy({ id });
	}

	remove(id: number) {
		return this.messageRepository.delete(id);
	}
}
