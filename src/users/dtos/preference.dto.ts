import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PreferenceDto {
	@IsOptional()
	@Expose()
	notificationEnabled?: boolean;

	@IsOptional()
	@Expose()
	fontColor?: string;

	@IsOptional()
	@Expose()
	fontSize?: number;

	@IsOptional()
	@Expose()
	allowPrivateMessagesFromOthers?: boolean;

	@IsOptional()
	@Expose()
	allowVoiceCallsFromOthers?: boolean;

	@IsOptional()
	@Expose()
	allowVideoCallsFromOthers?: boolean;
}
