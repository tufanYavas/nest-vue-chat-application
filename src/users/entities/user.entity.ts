import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	ManyToMany,
	JoinTable,
	OneToMany,
	ManyToOne,
	BeforeInsert,
} from 'typeorm';
import { LoginLog } from '../../login-log/login-log.entity';
import { Status } from '../../status/entities/status.entity';
import { Rank } from '../../rank/entities/rank.entity';
import { Permission } from './permission.entity';
import { Preference } from './preference.entity';
import { Message } from '../../message/entities/message.entity';
import { Report } from '../../report/entities/report.entity';
import { hashPassword } from '../../utils';

@Entity()
export class User {
	//#region Properties
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@Column({ default: 1 })
	statusId: number;

	@Column({ nullable: true })
	about: string;

	@Column({ nullable: true })
	profileImage: string;

	@Column({ default: 1 })
	rankId: number;

	@Column()
	gender: boolean;

	@Column({ default: false })
	banned: boolean;

	@Column({ default: false })
	preventMic: boolean;

	@Column({ default: false })
	preventCam: boolean;

	@Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
	created: Date;

	//#endregion

	//#region Relationships
	@OneToMany(() => LoginLog, (loginLog) => loginLog.user, {
		cascade: ['update'],
	})
	loginLogs: LoginLog[];

	@OneToOne(() => Permission, {
		cascade: ['update'],
	})
	@JoinColumn()
	permission: Permission;

	@ManyToMany(() => User, {
		cascade: ['update'],
	})
	@JoinTable()
	bannedUsers: User[];

	@OneToOne(() => Preference, (preference) => preference.user, {
		cascade: ['update'],
	})
	@JoinColumn()
	preference: Preference;

	@ManyToOne(() => Status, (status) => status.users, {
		cascade: ['update'],
	})
	@JoinColumn({ name: 'statusId' })
	status: Status;

	@ManyToOne(() => Rank, (rank) => rank.users, {
		cascade: ['update'],
	})
	@JoinColumn({ name: 'rankId' })
	rank: Rank;

	@OneToMany(() => Message, (message) => message.sender)
	messages: Message[];

	// Report relationships
	@OneToMany(() => Report, (report) => report.sender)
	sentReports: Report[];

	@OneToMany(() => Report, (report) => report.reportedUser)
	receivedReports: Report[];

	//#endregion

	@BeforeInsert()
	async hashPassword() {
		this.password = await hashPassword(this.password);
	}

	// @AfterInsert()
	// logInsert() {
	// 	console.log('Inserted User with id', this.id);
	// }

	// @AfterUpdate()
	// logUpdate() {
	// 	console.log('Updated User with id', this.id);
	// }

	// @AfterRemove()
	// logRemove() {
	// 	console.log('Removed User with id', this.id);
	// }
}
