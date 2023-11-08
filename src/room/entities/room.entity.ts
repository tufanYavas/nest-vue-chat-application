import { Message } from '../../message/entities/message.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Room {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	row: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	slogan: string;

	@Column({ default: false })
	default: boolean;

	@Column({ nullable: true, default: 'https://wallpapercave.com/wp/wp4410724.jpg' })
	bg: string;

	@Column({ nullable: true })
	password: string;

	@OneToMany(() => Message, (message) => message.room)
	messages: Message[];

	hasPassword: boolean;
}
