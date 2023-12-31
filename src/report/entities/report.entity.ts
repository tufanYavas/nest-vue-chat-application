import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Report {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	message: string;

	@Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
	created: Date;

	@Column({ default: false })
	read: boolean;

	@ManyToOne(() => User, (user) => user.sentReports)
	@JoinColumn()
	sender: User;

	@ManyToOne(() => User, (user) => user.receivedReports)
	@JoinColumn()
	reportedUser: User;
}
