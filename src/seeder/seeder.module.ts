import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UsersModule } from '../users/users.module';
import { RankModule } from '../rank/rank.module';
import { StatusModule } from '../status/status.module';
import { RoomModule } from '../room/room.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
	imports: [SeederModule, UsersModule, RankModule, StatusModule, RoomModule, SettingsModule],
	providers: [SeederService],
	exports: [SeederService],
})
export class SeederModule {}
