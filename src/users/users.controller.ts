import {
	Body,
	Controller,
	Post,
	Get,
	Patch,
	Session,
	UseGuards,
	UploadedFile,
	UseInterceptors,
	HttpStatus,
	HttpException,
	MaxFileSizeValidator,
	ParseFilePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ValidateUserResponseType } from '../enums';
import { AuthGuard } from '../guards/auth.guard';
import { AuthNonGuestGuard } from '../guards/auth-non-guest.guard';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { getFileInterceptor } from '../utils';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('uploadProfileImage')
	@UseGuards(AuthNonGuestGuard)
	@UseInterceptors(getFileInterceptor('./client/public/uploads/profile-images'))
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
		const oldImageFullPath = path.join(
			process.cwd(),
			`./client/public/uploads/profile-images/${user.profileImage}`,
		);

		if (fs.existsSync(oldImageFullPath)) {
			fs.unlinkSync(oldImageFullPath);
		}

		user.profileImage = file.filename;
		this.usersService.save(user);
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
		if (!user) {
			throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}
		if (user.id == -1) {
			user.username = session.user.username;
			user.gender = session.user.gender;
		}
		return user;
	}

	@UseGuards(AuthNonGuestGuard)
	@Post('setStatus')
	async setStatus(@Body('id') id: number, @Session() session: Express.Request['session']) {
		return await this.usersService.setStatus(session.user, id);
	}

	@Post('validateUser')
	async validateUser(@Body('username') username: string) {
		const user = await this.usersService.findOneWithRelations({ username }, ['rank']);
		if (!user) return ValidateUserResponseType.USER_NOT_FOUND;
		else if (user.rank.value > 1) return ValidateUserResponseType.USER_CAN_LOGIN_AS_AGENT;
		else return ValidateUserResponseType.USER_CANT_LOGIN_AS_AGENT;
	}
}
