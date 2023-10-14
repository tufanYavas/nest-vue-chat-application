import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginLogService } from '../loginlog/loginlog.service';
import { RankService } from '../rank/rank.service';
import { Preference } from './entities/preference.entity';
import { Permission } from './entities/permission.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { StatusService } from '../status/status.service';

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

	getUserLogs(userId: number) {
		return this.loginLogService.getAllLogsOfUser(userId);
	}

	getAllLogs() {
		return this.loginLogService.getAllLogs();
	}

	async createUserDontSave(options: DeepPartial<User>) {
		const user = this.usersRepository.create(options);

		const permission = await this.permissionRepository.save(
			this.permissionRepository.create(),
		);
		user.permission = permission;

		const preference = await this.preferenceRepository.save(
			this.preferenceRepository.create(),
		);
		user.preference = preference;

		const defaultRank = await this.rankRepository.findOne(
			parseInt(process.env.DEFAULT_RANK_ID),
		);
		console.log({ defaultRank });
		user.rank = defaultRank;

		const defaultStatus = await this.statusRepository.findOne(
			parseInt(process.env.DEFAULT_STATUS_ID),
		);

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
			throw new NotFoundException('user not found');
		}
		Object.assign(user, attrs);
		return this.usersRepository.save(user);
	}

	async remove(id: number) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('user not found');
		}
		return this.usersRepository.remove(user);
	}
}
