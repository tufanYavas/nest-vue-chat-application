import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginLog } from './login-log.entity';
import { LoginLogService } from './login-log.service';
import { LoginLogRepository } from './login-log.repository';

@Module({
	providers: [LoginLogService, LoginLogRepository],
	imports: [TypeOrmModule.forFeature([LoginLog])],
	exports: [LoginLogService],
})
export class LoginlogModule {}
