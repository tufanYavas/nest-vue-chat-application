import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginLog } from './loginlog.entity';
import { LoginLogService } from './loginlog.service';

@Module({
	providers: [LoginLogService],
	imports: [TypeOrmModule.forFeature([LoginLog])],
	exports: [LoginLogService],
})
export class LoginlogModule {}
