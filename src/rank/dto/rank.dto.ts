import { Expose } from 'class-transformer';

export class RankDto {
	@Expose()
	id: number;

	@Expose()
	name: string;

	@Expose()
	value: number;
}
