import { Controller, Get, Param } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
	constructor(private readonly rankService: RankService) {}

	@Get()
	findAll() {
		return this.rankService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.rankService.findOne(+id);
	}
}
