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
} from 'typeorm';
import { Permission } from './permission.entity';
import { Preference } from './preference.entity';
import { LoginLog } from '../loginlog/loginlog.entity';

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
  status: number;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ default: 1 })
  type: number;

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
