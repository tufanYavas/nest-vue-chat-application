import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Preference {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: true })
	notificationEnabled: boolean;

	@Column({ default: '000000' })
	fontColor: string;

	@Column({ default: 10 })
	fontSize: number;

	@Column({ default: true })
	allowPrivateMessagesFromOthers: boolean;

	@Column({ default: true })
	allowVoiceCallsFromOthers: boolean;

	@Column({ default: true })
	allowVideoCallsFromOthers: boolean;

	@OneToOne(() => User, (user) => user.preference)
	user: User;
}
