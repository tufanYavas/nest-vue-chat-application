import { User } from '../user.entity';

declare global {
	namespace Express {
		interface Request {
			currentUser?: User;
			session?: {
				user?: User;
				[key: string]: any;
			};
		}
	}
}
