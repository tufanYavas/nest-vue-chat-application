import {
	AfterInsert,
	AfterRemove,
	AfterUpdate,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	ManyToMany,
	JoinTable,
	OneToMany,
	ManyToOne,
} from 'typeorm';
import { LoginLog } from '../../loginlog/loginlog.entity';
import { Status } from '../../status/entities/status.entity';
import { Rank } from '../../rank/entities/rank.entity';
import { Permission } from './permission.entity';
import { Preference } from './preference.entity';
import { Message } from '../../message/entities/message.entity';
import { Report } from '../../report/entities/report.entity';

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
	@OneToMany(() => LoginLog, (loginLog) => loginLog.user)
	loginLogs: LoginLog[];

	@OneToOne(() => Permission)
	@JoinColumn()
	permission: Permission;

	@ManyToMany(() => User)
	@JoinTable()
	bannedUsers: User[];

	@OneToOne(() => Preference, (preference) => preference.user, {
		cascade: true,
	})
	@JoinColumn()
	preference: Preference;

	@ManyToOne(() => Status, (status) => status.users)
	@JoinColumn({ name: 'statusId' })
	status: Status;

	@ManyToOne(() => Rank, (rank) => rank.users)
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

	@AfterInsert()
	logInsert() {
		console.log('Inserted User with id', this.id);
	}

	@AfterUpdate()
	logUpdate() {
		console.log('Updated User with id', this.id);
	}

	@AfterRemove()
	logRemove() {
		console.log('Removed User with id', this.id);
	}
}
