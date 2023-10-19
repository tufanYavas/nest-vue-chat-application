import { Injectable } from '@nestjs/common';
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
	) {}

	async run() {
		await this.seedSettings();
		await this.seedRanks();
		await this.seedStatus();
		await this.seedUsers();
		await this.seedRooms();
		console.log('All data seeded');
	}

	async seedSettings() {
		await this.settingsService.create({
			id: 1,
		});
		console.log('Settings seeded');
	}

	async seedStatus() {
		await this.statusService.create({ name: 'Online' });
		await this.statusService.create({ name: 'Offline' });
		await this.statusService.create({ name: 'AFK' });
		console.log('Statusses seeded');
	}

	async seedRanks() {
		await this.rankService.create({ value: 0, name: 'Guest' });
		await this.rankService.create({ value: 1, name: 'Member' });
		await this.rankService.create({ value: 2, name: 'Admin' });
		await this.rankService.create({ value: 3, name: 'CoAdmin' });
		await this.rankService.create({ value: 4, name: 'Super Admin' });
		await this.rankService.create({ value: 5, name: 'Chat Admin' });
		await this.rankService.create({ value: 6, name: 'Root' });
		console.log('Ranks seeded');
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
		await this.usersService.save([rootUser]);

		await this.usersService.create({
			id: -1,
			username: 'guest',
			gender: true,
			password: '',
		});

		console.log('Users seeded');
	}

	async seedRooms() {
		await this.roomService.create({
			active: true,
			name: 'Room',
			slogan: 'Best Room',
			default: true,
			row: 1,
			bg: null,
			password: null,
		}),
			console.log('Rooms seeded');
	}
}
