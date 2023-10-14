import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginLog } from './loginlog.entity';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class LoginLogService {
	constructor(
		@InjectRepository(LoginLog)
		private readonly loginLogRepository: Repository<LoginLog>,
	) {}

	async createLog(user: User, req: Request): Promise<LoginLog> {
		const log: Partial<LoginLog> = {
			userId: user.id,
			username: user.username,
			isMobile: /mobile/i.test(req.headers['user-agent'] || ''),
			ip: req.ip.replace('::ffff:', ''),
			userAgent: req.headers['user-agent'] || '',
		};
		console.log(log);
		const newLog = this.loginLogRepository.create(log);
		return await this.loginLogRepository.save(newLog);
	}

	async getAllLogs(): Promise<LoginLog[]> {
		return await this.loginLogRepository.find();
	}

	async getAllLogsOfUser(userId): Promise<LoginLog[]> {
		return await this.loginLogRepository.find({
			where: { userId: userId },
		});
	}
}
