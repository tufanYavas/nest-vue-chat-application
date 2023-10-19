import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginLogService } from '../login-log/login-log.service';
import { RankService } from '../rank/rank.service';
import { Preference } from './entities/preference.entity';
import { Permission } from './entities/permission.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { StatusService } from '../status/status.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { comparePasswords, hashPassword } from '../utils';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(Preference)
		private readonly preferenceRepository: Repository<Preference>,
		@InjectRepository(Permission)
		private readonly permissionRepository: Repository<Permission>,
		private readonly loginLogService: LoginLogService,
		private readonly rankRepository: RankService,
		private readonly statusRepository: StatusService,
	) {}

	save(users: DeepPartial<User>[]) {
		return this.usersRepository.save(users);
	}

	async setStatus(user: User, id: number) {
		const status = await this.statusRepository.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		if (!status) {
			throw new NotFoundException('Status not found');
		}
		user.status = status;

		// if not guest
		if (user.id > 0) {
			this.usersRepository.save(user);
		}
		return status;
	}

	getUserLogs(userId: number) {
		return this.loginLogService.getAllLogsOfUser(userId);
	}

	getAllLogs() {
		return this.loginLogService.getAllLogs();
	}

	async createUserDontSave(options: DeepPartial<User>) {
		const user = this.usersRepository.create(options);

		const permission = await this.permissionRepository.save(this.permissionRepository.create());
		user.permission = permission;

		const preference = await this.preferenceRepository.save(this.preferenceRepository.create());
		user.preference = preference;

		const defaultRank = await this.rankRepository.findOne(parseInt(process.env.DEFAULT_RANK_ID));
		user.rank = defaultRank;

		const defaultStatus = await this.statusRepository.findOne(parseInt(process.env.DEFAULT_STATUS_ID));
		user.status = defaultStatus;

		return user;
	}

	async create(options: DeepPartial<User>) {
		const user = await this.createUserDontSave(options);

		return this.usersRepository.save(user);
	}

	findOne(id: number) {
		if (!id) {
			return null;
		}
		return this.usersRepository.findOneBy({ id });
	}

	findOneWithAllRelations(where: object) {
		return this.usersRepository.findOne({
			where,
			relations: ['permission', 'preference', 'status', 'rank'],
		});
	}

	findOneWithRelations(where: object, relations: string[]) {
		return this.usersRepository.findOne({ where, relations });
	}

	findOneBy(json: object) {
		return this.usersRepository.findOneBy(json);
	}

	find(username: string) {
		return this.usersRepository.find({ where: { username } });
	}

	findWithRelations(where: object, relations: string[]) {
		return this.usersRepository.find({ where, relations });
	}

	async update(id: number, attrs: Partial<User>) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		Object.assign(user, attrs);
		return this.usersRepository.save(user);
	}

	async remove(id: number) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return this.usersRepository.remove(user);
	}

	async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
		const user = await this.findOneWithAllRelations({ id: userId });

		if (updateProfileDto.oldPassword && updateProfileDto.newPassword) {
			const isMatch = await comparePasswords(user.password, updateProfileDto.oldPassword);

			if (!isMatch) {
				throw new BadRequestException('Old password does not match');
			}
			user.password = await hashPassword(updateProfileDto.newPassword);
		}

		if (updateProfileDto.about) {
			user.about = updateProfileDto.about;
		}

		if (user.preference) {
			user.preference.allowPrivateMessagesFromOthers =
				updateProfileDto.allowPrivateMessagesFromOthers ?? user.preference.allowPrivateMessagesFromOthers;
			user.preference.allowVoiceCallsFromOthers =
				updateProfileDto.allowVoiceCallsFromOthers ?? user.preference.allowVoiceCallsFromOthers;
			user.preference.allowVideoCallsFromOthers =
				updateProfileDto.allowVideoCallsFromOthers ?? user.preference.allowVideoCallsFromOthers;
			user.preference.notificationEnabled =
				updateProfileDto.notificationEnabled ?? user.preference.notificationEnabled;
		}
		this.usersRepository.save(user);
		return user;
	}
}
