import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';
import { LoginlogModule } from '../login-log/login-log.module';
import { SettingsModule } from '../settings/settings.module';
import { EventsService } from './events.service';
import { RoomModule } from '../room/room.module';

@Module({
	providers: [EventsGateway, EventsService],
	imports: [forwardRef(() => RoomModule), AuthModule, LoginlogModule, SettingsModule],
	exports: [EventsGateway],
})
export class EventsModule {}
