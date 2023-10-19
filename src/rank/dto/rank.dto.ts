import { Expose } from 'class-transformer';

export class RankDto {
	@Expose()
	name: string;

	@Expose()
	value: number;
}
