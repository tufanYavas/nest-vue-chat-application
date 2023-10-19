import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LoginLog } from './login-log.entity';

@Injectable()
export class LoginLogRepository extends Repository<LoginLog> {
	constructor(private dataSource: DataSource) {
		super(LoginLog, dataSource.createEntityManager());
	}

	async findLatestLoginByUsername(username: string): Promise<LoginLog | undefined> {
		return this.createQueryBuilder('loginLog')
			.where('loginLog.username = :username', { username })
			.orderBy('loginLog.date', 'DESC')
			.getOne();
	}

	async getAllLogs(): Promise<LoginLog[]> {
		return this.find();
	}

	async getAllLogsOfUser(userId: number): Promise<LoginLog[]> {
		return this.find({ where: { userId } });
	}
}
