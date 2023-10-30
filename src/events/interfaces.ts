import { Socket } from 'socket.io';
import { IUserForClient } from '../server.interfaces';
import { UserForSocket } from './user-for-socket';

export interface SocketWithData extends Socket {
	data: {
		user: UserForSocket;
		privateChatting?: {
			caller: UserForSocket;
			called: UserForSocket;
			callerClient: SocketWithData;
			calledClient: SocketWithData;
		};
	};
}

export interface IUserForSocket extends IUserForClient {
	ip: string;
}

export interface ISendMessage {
	user: IUserForClient;
	text: string;
	type: 'ROOM_MESSAGE' | 'ALL_MESSAGE' | 'SYSTEM_MESSAGE' | 'PRIVATE_MESSAGE' | 'ROOM_EVENT' | 'ALL_EVENT';
	toClientId?: string;
	contentType?: 'IMAGE';
	contentPath?: string;
}
