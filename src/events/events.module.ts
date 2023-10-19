import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';
import { LoginlogModule } from '../login-log/login-log.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
	providers: [EventsGateway],
	imports: [AuthModule, LoginlogModule, SettingsModule],
})
export class EventsModule {}
