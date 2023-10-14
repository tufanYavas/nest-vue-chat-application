import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginLogService } from 'src/loginlog/loginlog.service';
import { RankService } from 'src/rank/rank.service';
import { Preference } from './entities/preference.entity';
import { Permission } from './entities/permission.entity';

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
	) {}

	getUserLogs(userId: number) {
		return this.loginLogService.getAllLogsOfUser(userId);
	}

	getAllLogs() {
		return this.loginLogService.getAllLogs();
	}

	async create(username: string, password: string, gender: boolean) {
		const user = this.usersRepository.create({
			username,
			password,
			gender,
		});

		const preference = this.preferenceRepository.create();
		user.preference = preference;

		const permission = this.permissionRepository.create();
		user.permission = permission;

		const defaultRank = await this.rankRepository.findOne(
			parseInt(process.env.DEFAULT_RANK_ID),
		);

		user.rank = defaultRank;

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
