import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LoginlogModule } from '../login-log/login-log.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
	imports: [forwardRef(() => UsersModule), LoginlogModule, SettingsModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
