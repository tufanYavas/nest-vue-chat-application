import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LoginlogModule } from '../login-log/login-log.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
	imports: [UsersModule, LoginlogModule, SettingsModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
