import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Status {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => User, (user) => user.status)
	users: User[];
}
