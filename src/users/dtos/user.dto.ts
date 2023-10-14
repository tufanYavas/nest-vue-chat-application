import { Expose } from 'class-transformer';

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
	status: number;

	@Expose()
	type: number;

	@Expose()
	banned: boolean;

	@Expose()
	preventMic: boolean;

	@Expose()
	preventCam: boolean;

	@Expose()
	created: Date;
}
