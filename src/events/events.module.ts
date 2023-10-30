import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';
import { LoginlogModule } from '../login-log/login-log.module';
import { SettingsModule } from '../settings/settings.module';
import { SocketService } from './socket.service';
import { RoomModule } from '../room/room.module';

@Module({
	providers: [EventsGateway, SocketService],
	imports: [AuthModule, LoginlogModule, SettingsModule, RoomModule],
})
export class EventsModule {}
