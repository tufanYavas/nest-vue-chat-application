import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SettingsService {
	constructor(
		@InjectRepository(Setting)
		private readonly settingsRepository: Repository<Setting>,
	) {}

	create(options: DeepPartial<Setting>) {
		const setting = this.settingsRepository.create(options);
		return this.settingsRepository.save(setting);
	}

	getSettings() {
		return this.settingsRepository.findOneBy({ id: 1 });
	}

	update(id: number, updateSettingDto: UpdateSettingDto) {
		return this.settingsRepository.update(id, updateSettingDto);
	}
}
