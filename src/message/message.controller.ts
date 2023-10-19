import { Controller, Get, Post, Body, Param, Delete, Session, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { MessageDto } from './dto/message.dto';
import { AuthGuard } from '../guards/auth.guard';

@Serialize(MessageDto)
@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@UseGuards(AuthGuard)
	@Post()
	create(@Body() createMessageDto: CreateMessageDto, @Session() session: Express.Request['session']) {
		const sender = session.user;
		return this.messageService.create(sender, createMessageDto);
	}

	@Get()
	findAll() {
		return this.messageService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.messageService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.messageService.remove(+id);
	}
}
