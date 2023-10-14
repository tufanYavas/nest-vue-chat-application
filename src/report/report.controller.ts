import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
	Session,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('report')
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@UseGuards(AuthGuard)
	@Post()
	create(
		@Body() createReportDto: CreateReportDto,
		@Session() session: Express.Request['session'],
	) {
		const sender = session.user;
		return this.reportService.create(sender, createReportDto);
	}

	@Get()
	findAll() {
		return this.reportService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.reportService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.reportService.remove(+id);
	}
}
