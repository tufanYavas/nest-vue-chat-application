import { Controller, Get, Body, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Get()
	getSettings() {
		return this.settingsService.getSettings();
	}

	@Patch()
	update(@Body() updateSettingDto: UpdateSettingDto) {
		return this.settingsService.update(1, updateSettingDto);
	}
}
