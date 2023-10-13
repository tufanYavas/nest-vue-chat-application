import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class LoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  isVisitor: boolean;

  @Column()
  username: string;

  @Column()
  isMobile: boolean;

  @Column()
  ip: string;

  @Column()
  userAgent: string;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => User, (user) => user.loginLogs)
  user: User;
}
