import { Room } from '../../room/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	content: string;

	@Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
	created: Date;

	// User relationship
	@ManyToOne(() => User, (user) => user.messages)
	@JoinColumn({ name: 'senderId' })
	sender: User;

	// Room relationship
	@ManyToOne(() => Room, (room) => room.messages)
	@JoinColumn({ name: 'roomId' })
	room: Room;
}
