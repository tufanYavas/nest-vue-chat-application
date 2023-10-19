import {
	Body,
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Param,
	Query,
	NotFoundException,
	Session,
	UseGuards,
	UploadedFile,
	UseInterceptors,
	HttpStatus,
	HttpException,
	MaxFileSizeValidator,
	ParseFilePipe,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ValidateUserResponseType } from '../enums';
import { AuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthNonGuestGuard } from '../guards/auth-non-guest.guard';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('uploadProfileImage')
	@UseGuards(AuthNonGuestGuard)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './client/public/uploads/images',
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
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [new MaxFileSizeValidator({ maxSize: 2097152 })],
			}),
		)
		file: Express.Multer.File,
		@Session() session: Express.Request['session'],
	) {
		if (!file) {
			throw new HttpException('Invalid file.', HttpStatus.BAD_REQUEST);
		}
		const user = await this.usersService.findOne(session.user.id);
		const oldImageFullPath = path.join(process.cwd(), `./client/public/uploads/images/${user.profileImage}`);
		console.log(oldImageFullPath);
		if (fs.existsSync(oldImageFullPath)) {
			fs.unlinkSync(oldImageFullPath);
		}

		user.profileImage = file.filename;
		this.usersService.save([user]);
		return { profileImage: file.filename };
	}

	@UseGuards(AuthNonGuestGuard)
	@Patch('/updateProfile')
	async updateProfile(@Session() session: Express.Request['session'], @Body() body: UpdateProfileDto) {
		return this.usersService.updateProfile(session.user.id, body);
	}

	@Get('/me')
	@UseGuards(AuthGuard)
	async me(@Session() session: Express.Request['session']) {
		const user = await this.usersService.findOneWithAllRelations({
			id: session.user.id,
		});
		if (user.id == -1) {
			user.username = session.user.username;
		}
		return user;
	}

	@Post('setStatus')
	async setStatus(@Body('id') id: number, @Session() session: Express.Request['session']) {
		return await this.usersService.setStatus(session.user, id);
	}

	@Get('/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.usersService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Get()
	findAllUsers(@Query('username') username: string) {
		return this.usersService.find(username);
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.update(parseInt(id), body);
	}

	@Post('validateUser')
	async validateUser(@Body('username') username: string) {
		const user = await this.usersService.findOneWithRelations({ username }, ['rank']);
		if (!user) return ValidateUserResponseType.USER_NOT_FOUND;
		else if (user.rank.value > 1) return ValidateUserResponseType.USER_CAN_LOGIN_AS_AGENT;
		else return ValidateUserResponseType.USER_CANT_LOGIN_AS_AGENT;
	}
}
