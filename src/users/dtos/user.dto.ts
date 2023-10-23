import { Expose, Type } from 'class-transformer';
import { RankDto } from '../../rank/dto/rank.dto';
import { PermissionDto } from './permission.dto';
import { PreferenceDto } from './preference.dto';
import { StatusDto } from '../../status/dto/status.dto';

export class UserDto {
	@Expose()
	username: string;

	@Expose()
	gender: boolean;

	@Expose()
	about?: string;

	@Expose()
	profileImage?: string;

	@Expose()
	banned: boolean;

	@Expose()
	preventMic: boolean;

	@Expose()
	preventCam: boolean;

	@Expose()
	created: Date;

	// status name
	@Expose()
	name: Date;

	@Expose()
	@Type(() => PermissionDto)
	permission: PermissionDto;

	@Expose()
	@Type(() => PreferenceDto)
	preference: PreferenceDto;

	@Expose()
	@Type(() => StatusDto)
	status: StatusDto;

	@Expose()
	@Type(() => RankDto)
	rank: RankDto;
}
