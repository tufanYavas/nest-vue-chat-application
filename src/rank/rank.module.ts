import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { Rank } from './entities/rank.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	controllers: [RankController],
	providers: [RankService],
	imports: [TypeOrmModule.forFeature([Rank])],
	exports: [RankService],
})
export class RankModule {}
