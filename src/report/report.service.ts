import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from 'src/users/entities/user.entity';
import { Report } from 'src/report/entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
	constructor(
		@InjectRepository(Report)
		private readonly reportRepository: Repository<Report>,
	) {}

	async create(sender: User, createReportDto: CreateReportDto) {
		const reportedUser = await this.reportRepository.findOneBy({
			id: createReportDto.reportedUser,
		});
		if (!reportedUser) {
			throw new NotFoundException('User not found');
		}

		const report = this.reportRepository.create({
			message: createReportDto.message,
			read: false,
			reportedUser,
			sender: sender,
		});
		return this.reportRepository.save(report);
	}

	findAll() {
		return this.reportRepository.find({
			relations: ['sender', 'reportedUser'],
		});
	}

	findOne(id: number) {
		return this.reportRepository.findOneBy({ id });
	}

	remove(id: number) {
		return this.reportRepository.delete(id);
	}
}
