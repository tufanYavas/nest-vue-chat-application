import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Session,
	UseGuards,
	HttpException,
	HttpStatus,
	MaxFileSizeValidator,
	ParseFilePipe,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { MessageDto } from './dto/message.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { getFileInterceptor } from '../common/utils';

@Serialize(MessageDto)
@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post('uploadChatImage')
	@UseGuards(AuthGuard)
	@UseInterceptors(getFileInterceptor('./client/public/uploads/chat-images'))
	async uploadChatImage(
		@UploadedFile(
			new ParseFilePipe({
				validators: [new MaxFileSizeValidator({ maxSize: 2097152 })],
			}),
		)
		file: Express.Multer.File,
	) {
		if (!file) {
			throw new HttpException('Invalid file.', HttpStatus.BAD_REQUEST);
		}
		return { imagePath: file.filename };
	}

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
