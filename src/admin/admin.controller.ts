import {
	Controller,
	Body,
	ForbiddenException,
	Get,
	Patch,
	Session,
	UseGuards,
	NotFoundException,
	Param,
	Delete,
	SetMetadata,
	Post,
	HttpException,
	HttpStatus,
	MaxFileSizeValidator,
	ParseFilePipe,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { UsersService } from '../users/users.service';
import { Not, LessThan } from 'typeorm';
import { UpdateSettingDto } from './dtos/update-setting.dto';
import { UpdatePermissionsDto } from './dtos/update-permissions.dto';
import { UpdateUserDto } from '../users/dtos/update-user.dto';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { RoomService } from '../room/room.service';
import { UpdateRoomRowDto } from '../room/dto/update-room-row';
import { UpdateRoomDto } from '../room/dto/update-room.dto';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import * as path from 'path';
import * as fs from 'fs';
import { getFileInterceptor } from '../utils';
import { StatusService } from '../status/status.service';
import { UpdateStatusDto } from '../status/dto/update-status.dto';
import { CreateStatusDto } from '../status/dto/create-status.dto';
import { UpdateRankDto } from '../rank/dto/update-rank.dto';
import { RankService } from '../rank/rank.service';

@SetMetadata('permissions', ['canSeeAdminPanel'])
@UseGuards(PermissionsGuard)
@Serialize(UserDto)
@Controller('admin')
export class AdminController {
	constructor(
		private readonly settingsService: SettingsService,
		private readonly usersService: UsersService,
		private readonly roomsService: RoomService,
		private readonly statusService: StatusService,
		private readonly rankService: RankService,
	) {}

	@SetMetadata('permissions', ['canSeeAdminPanel'])
	@UseGuards(PermissionsGuard)
	@Get('/getUsers')
	async getUsers(@Session() session: Express.Request['session']) {
		const me = await this.usersService.findOneWithAllRelations({ id: session.user.id });
		session.user = me;
		if (me.permission.canSeeAdminPanel && me.permission.canEditUsers) {
			return this.usersService.findWithRelations({ id: Not(-1), rank: { value: LessThan(me.rank.value) } }, [
				'rank',
			]);
		}
	}

	@SetMetadata('permissions', ['canEditGeneralSettings'])
	@UseGuards(PermissionsGuard)
	@Patch('updateSettings')
	update(@Body() updateSettingDto: UpdateSettingDto, @Session() session: Express.Request['session']) {
		if (session.user && session.user.permission.canSeeAdminPanel) {
			return this.settingsService.update(1, updateSettingDto);
		} else throw new ForbiddenException('You have no right to update settings.');
	}

	@SetMetadata('permissions', ['canRemovePermissions'])
	@UseGuards(PermissionsGuard)
	@UseGuards()
	@Patch('updatePermissions')
	async updatePermissions(@Body() body: UpdatePermissionsDto, @Session() session: Express.Request['session']) {
		const me = await this.usersService.findOneWithAllRelations({ id: session.user.id });
		const user = await this.usersService.findOneWithAllRelations({ id: body.user_id });
		if (me.rank.value <= user.rank.value || !me.permission.canRemovePermissions)
			throw new ForbiddenException('You do not have permission for this action');
		return await this.usersService.updatePermissions(user, body);
	}

	@SetMetadata('permissions', ['canEditUsers'])
	@UseGuards(PermissionsGuard)
	@Get('/findUser/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.usersService.findOneWithAllRelations({ id: parseInt(id) });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@SetMetadata('permissions', ['canEditUsers'])
	@UseGuards(PermissionsGuard)
	@Patch('/updateUser/:id')
	updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
		return this.usersService.update(id, body);
	}

	@SetMetadata('permissions', ['canEditUsers', 'canBan'])
	@UseGuards(PermissionsGuard)
	@Post('/banUser/:id')
	banUser(@Param('id') id: number) {
		return this.usersService.banUser(id);
	}

	@SetMetadata('permissions', ['canEditUsers', 'canBan'])
	@UseGuards(PermissionsGuard)
	@Post('/unbanUser/:id')
	unbanUser(@Param('id') id: number) {
		return this.usersService.unbanUser(id);
	}

	@SetMetadata('permissions', ['canEditUsers'])
	@UseGuards(PermissionsGuard)
	@Post('/uploadProfileImage/:id')
	@UseInterceptors(getFileInterceptor('./client/public/uploads/profile-images'))
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [new MaxFileSizeValidator({ maxSize: 2097152 })],
			}),
		)
		file: Express.Multer.File,
		@Param('id') id: number,
	) {
		if (!file) {
			throw new HttpException('Invalid file.', HttpStatus.BAD_REQUEST);
		}
		const user = await this.usersService.findOne(id);
		const oldImageFullPath = path.join(
			process.cwd(),
			`./client/public/uploads/profile-images/${user.profileImage}`,
		);

		if (fs.existsSync(oldImageFullPath)) {
			fs.unlinkSync(oldImageFullPath);
		}

		user.profileImage = file.filename;
		await this.usersService.save(user);
		return { profileImage: file.filename };
	}

	@SetMetadata('permissions', ['canEditRooms'])
	@UseGuards(PermissionsGuard)
	@Patch('/makeDefaultRoom/:id')
	makeDefaultRoom(@Param('id') id: number) {
		return this.roomsService.makeDefaultRoom(id);
	}

	@SetMetadata('permissions', ['canEditRooms'])
	@UseGuards(PermissionsGuard)
	@Patch('/updateRoomRow/:id')
	updateRoomRow(@Param('id') id: number, @Body() updateRoomRowDto: UpdateRoomRowDto) {
		this.roomsService.updateRoomRow(id, updateRoomRowDto);
	}

	@SetMetadata('permissions', ['canEditRooms'])
	@UseGuards(PermissionsGuard)
	@Delete('/deleteRoom/:id')
	deleteRoom(@Param('id') id: number) {
		this.roomsService.remove(id);
	}

	@SetMetadata('permissions', ['canEditRooms'])
	@UseGuards(PermissionsGuard)
	@Patch('/updateRoom/:id')
	updateRoom(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
		return this.roomsService.update(+id, updateRoomDto);
	}

	@SetMetadata('permissions', ['canEditRooms'])
	@UseGuards(PermissionsGuard)
	@Post('/createRoom')
	createRoom(@Body() createRoomDto: CreateRoomDto) {
		return this.roomsService.create(createRoomDto);
	}

	@SetMetadata('permissions', ['canEditStatusList'])
	@UseGuards(PermissionsGuard)
	@Post('/createStatus')
	createStatus(@Body() createStatusDto: CreateStatusDto) {
		return this.statusService.create(createStatusDto);
	}

	@SetMetadata('permissions', ['canEditStatusList'])
	@UseGuards(PermissionsGuard)
	@Patch('/updateStatus/:id')
	editStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
		return this.statusService.update(+id, updateStatusDto);
	}

	@SetMetadata('permissions', ['canEditStatusList'])
	@UseGuards(PermissionsGuard)
	@Delete('/deleteStatus/:id')
	deleteStatus(@Param('id') id: string) {
		return this.statusService.remove(+id);
	}

	@SetMetadata('permissions', ['canEditRanks'])
	@UseGuards(PermissionsGuard)
	@Patch('/updateRank/:id')
	updateRank(@Param('id') id: string, @Body() updateRankDto: UpdateRankDto) {
		return this.rankService.update(+id, updateRankDto);
	}
}
