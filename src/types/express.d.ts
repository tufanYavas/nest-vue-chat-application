import { User } from '../users/entities/user.entity';

declare namespace Express {
	export interface Request {
		session?: {
			user?: User;
			[key: string]: any;
		};
	}
}
