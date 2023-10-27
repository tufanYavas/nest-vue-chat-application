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
import { Serialize } from '../interceptors/serialize.interceptor';
import { MessageDto } from './dto/message.dto';
import { AuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Serialize(MessageDto)
@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post('uploadChatImage')
	@UseGuards(AuthGuard)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './client/public/uploads/chat-images',
				filename: (req, file, cb) => {
					const randomName = Array(32)
						.fill(null)
						.map(() => Math.round(Math.random() * 16).toString(16))
						.join('');
					return cb(null, `${randomName}${extname(file.originalname)}`);
				},
			}),
			fileFilter: (req, file, cb) => {
				if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
					return cb(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
				}
				cb(null, true);
			},
		}),
	)
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
