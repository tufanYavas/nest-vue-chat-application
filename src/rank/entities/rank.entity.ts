import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Rank {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	value: number;

	@OneToMany(() => User, (user) => user.rank)
	users: User[];
}
