import { IsBoolean, IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateSettingDto {
	@IsOptional()
	@IsString({ message: 'title should be a string.' })
	@MaxLength(50, { message: 'title can be at most 18 characters long.' })
	title?: string;

	@IsOptional()
	@IsBoolean({ message: 'doubleLoginActive should be a boolean.' })
	doubleLoginActive?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'guestLoginActive should be a boolean.' })
	guestLoginActive?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'newMember should be a boolean.' })
	newMember?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'membersCanPM should be a boolean.' })
	membersCanPM?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'membersCanVoiceCall should be a boolean.' })
	membersCanVoiceCall?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'membersCanVideoCall should be a boolean.' })
	membersCanVideoCall?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'guestsCanPM should be a boolean.' })
	guestsCanPM?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'membersCanVoiceCall should be a boolean.' })
	guestsCanVoiceCall?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'membersCanVideoCall should be a boolean.' })
	guestsCanVideoCall?: boolean;
}
