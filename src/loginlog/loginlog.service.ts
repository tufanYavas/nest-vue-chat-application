import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginLog } from './loginlog.entity';

@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(LoginLog)
    private readonly loginLogRepository: Repository<LoginLog>,
  ) {}

  async createLog(log: Partial<LoginLog>): Promise<LoginLog> {
    const newLog = this.loginLogRepository.create(log);
    return await this.loginLogRepository.save(newLog);
  }

  async getAllLogs(): Promise<LoginLog[]> {
    return await this.loginLogRepository.find();
  }

  async getAllLogsOfUser(userId): Promise<LoginLog[]> {
    return await this.loginLogRepository.find({ where: { userId: userId } });
  }
}
