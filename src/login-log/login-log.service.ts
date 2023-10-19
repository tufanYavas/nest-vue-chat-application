import { Injectable } from '@nestjs/common';
import { LoginLog } from './login-log.entity';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';
import { LoginLogRepository } from './login-log.repository';

@Injectable()
export class LoginLogService {
	constructor(private readonly loginLogRepository: LoginLogRepository) {}

	async getLatestLoginIpByUsername(username: string): Promise<string | null> {
		const latestLogin = await this.loginLogRepository.findLatestLoginByUsername(username);
		return latestLogin ? latestLogin.ip : null;
	}

	async createLog(user: User, req: Request): Promise<LoginLog> {
		const log: Partial<LoginLog> = {
			userId: user.id,
			username: user.username,
			isMobile: /mobile/i.test(req.headers['user-agent'] || ''),
			ip: req.ip.replace('::ffff:', ''),
			userAgent: req.headers['user-agent'] || '',
		};

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
