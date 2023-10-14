import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	controllers: [ReportController],
	providers: [ReportService],
	imports: [TypeOrmModule.forFeature([Report])],
	exports: [ReportService],
})
export class ReportModule {}
