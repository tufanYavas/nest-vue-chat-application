import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { SettingsModule } from '../settings/settings.module';
import { UsersModule } from '../users/users.module';
import { RoomModule } from '../room/room.module';
import { StatusModule } from '../status/status.module';
import { RankModule } from '../rank/rank.module';

@Module({
	controllers: [AdminController],
	imports: [SettingsModule, UsersModule, RoomModule, StatusModule, RankModule],
})
export class AdminModule {}
