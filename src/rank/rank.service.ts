import { Injectable } from '@nestjs/common';
import { CreateRankDto } from './dto/create-rank.dto';
import { UpdateRankDto } from './dto/update-rank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rank } from './entities/rank.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RankService {
	constructor(
		@InjectRepository(Rank)
		private readonly rankRepository: Repository<Rank>,
	) {}

	create(createRankDto: CreateRankDto) {
		const rank = this.rankRepository.create(createRankDto);
		return this.rankRepository.save(rank);
	}

	findAll() {
		return this.rankRepository.find({});
	}

	findOne(id: number) {
		return this.rankRepository.findOneBy({ id });
	}

	update(id: number, updateRankDto: UpdateRankDto) {
		return this.rankRepository.update(id, updateRankDto);
	}

	remove(id: number) {
		return this.rankRepository.delete(id);
	}
}
