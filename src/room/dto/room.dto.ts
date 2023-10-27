import { Expose } from 'class-transformer';

export class RoomDto {
	@Expose()
	id: number;

	@Expose()
	row: number;

	@Expose()
	name: string;

	@Expose()
	slogan?: string;

	@Expose()
	active: boolean;

	@Expose()
	default: boolean;

	@Expose()
	bg?: string;

	@Expose()
	hasPassword: boolean;
}
