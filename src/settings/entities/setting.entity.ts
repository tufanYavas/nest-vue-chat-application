import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Setting {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 'Chat Application' })
	title: string;

	@Column({ default: 'logo.png' })
	logo: string;

	@Column({ default: '#0f1012' })
	themeColor: string;

	@Column({ default: true })
	doubleLoginActive: boolean;

	@Column({ default: true })
	guestLoginActive: boolean;

	@Column({ default: true })
	newMemberActive: boolean;

	@Column({ default: true })
	membersCanPM: boolean;

	@Column({ default: true })
	membersCanVoiceCall: boolean;

	@Column({ default: true })
	membersCanVideoCall: boolean;

	@Column({ default: true })
	guestsCanPM: boolean;

	@Column({ default: true })
	guestsCanVoiceCall: boolean;

	@Column({ default: true })
	guestsCanVideoCall: boolean;
}
