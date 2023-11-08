import { plainToClass } from 'class-transformer';
import { IRoom, IPermission, IPreference, IRank, IStatus } from '../server.interfaces';
import { SocketUserDto } from './dtos/socket-user.dto';
import { IUserForSocket } from './interfaces';

export class UserForSocket implements IUserForSocket {
	constructor(
		public id: number,
		public room: IRoom,
		public ip: string,
		public clientId: string,
		public username: string,
		public gender: boolean,
		public about: string,
		public profileImage: string,
		public banned: boolean,
		public preventMic: boolean,
		public preventCam: boolean,
		public created: Date,
		public permission: IPermission,
		public preference: IPreference,
		public status: IStatus,
		public rank: IRank,
	) {}

	getDto(): SocketUserDto {
		return plainToClass(SocketUserDto, this, {
			excludeExtraneousValues: true,
		});
	}
}
