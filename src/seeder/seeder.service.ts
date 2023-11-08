import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RankService } from '../rank/rank.service';
import { StatusService } from '../status/status.service';
import { RoomService } from '../room/room.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class SeederService {
	constructor(
		private readonly usersService: UsersService,
		private readonly rankService: RankService,
		private readonly statusService: StatusService,
		private readonly roomService: RoomService,
		private readonly settingsService: SettingsService,
		@Inject('LoggerService') private readonly loggerService: LoggerService,
	) {}

	async run() {
		await this.seedSettings();
		await this.seedRanks();
		await this.seedStatus();
		await this.seedUsers();
		await this.seedRooms();
		this.loggerService.log('All data seeded');
	}

	async seedSettings() {
		await this.settingsService.create({
			id: 1,
		});
		this.loggerService.log('Settings seeded');
	}

	async seedStatus() {
		await this.statusService.create({ name: 'Online' });
		await this.statusService.create({ name: 'Offline' });
		await this.statusService.create({ name: 'AFK' });
		this.loggerService.log('Statusses seeded');
	}

	async seedRanks() {
		await this.rankService.create({ value: 0, name: 'Guest' });
		await this.rankService.create({ value: 1, name: 'Member' });
		await this.rankService.create({ value: 2, name: 'Admin' });
		await this.rankService.create({ value: 3, name: 'CoAdmin' });
		await this.rankService.create({ value: 4, name: 'Super Admin' });
		await this.rankService.create({ value: 5, name: 'Chat Admin' });
		await this.rankService.create({ value: 6, name: 'Root' });
		this.loggerService.log('Ranks seeded');
	}

	async seedUsers() {
		const rootUser = await this.usersService.create({
			username: 'root',
			gender: true,
			password: '123456',
		});
		for (const key in rootUser.permission) {
			if (key.startsWith('can')) {
				rootUser.permission[key] = true;
			}
		}
		rootUser.rank = await this.rankService.findOne(7);
		await this.usersService.save(rootUser);

		const guestUser = await this.usersService.create({
			id: -1,
			username: 'guest',
			gender: true,
			password: '',
		});
		guestUser.rank = await this.rankService.findOne(1);
		await this.usersService.save(guestUser);

		this.loggerService.log('Users seeded');
	}

	async seedRooms() {
		await this.roomService.create({
			name: 'Room',
			slogan: 'Best Room',
			default: true,
			row: 1,
			bg: null,
			password: null,
		});
		await this.roomService.create({
			name: 'Room 2',
			slogan: 'Best Room 2',
			default: false,
			row: 2,
			bg: null,
			password: null,
		});
		await this.roomService.create({
			name: 'Room 3',
			slogan: 'Best Room 3',
			default: false,
			row: 3,
			bg: null,
			password: null,
		});
		this.loggerService.log('Rooms seeded');
	}
}
