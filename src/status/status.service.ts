import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService {
	constructor(
		@InjectRepository(Status)
		private readonly statusRepository: Repository<Status>,
	) {}

	async create(createStatusDto: CreateStatusDto) {
		const status = this.statusRepository.create(createStatusDto);
		return await this.statusRepository.save(status);
	}

	async findAll() {
		return this.statusRepository.find({});
	}

	async findOne(id: number) {
		return this.statusRepository.findOneBy({ id });
	}

	async update(id: number, updateStatusDto: UpdateStatusDto) {
		return this.statusRepository.update(id, updateStatusDto);
	}

	async remove(id: number) {
		return this.statusRepository.delete(id);
	}
}
