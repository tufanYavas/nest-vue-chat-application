import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginLogService } from '../login-log/login-log.service';
import { RoomService } from '../room/room.service';
import { SettingsService } from '../settings/settings.service';
import { Server } from 'socket.io';
import { ISendMessage, SocketWithData } from './interfaces';
import { SocketEventType } from './socket.enum';
import { UserForSocket } from './user-for-socket';
import { WsResponse } from '@nestjs/websockets/interfaces/ws-response.interface';
import { IRoom, IUserForClient } from '../server.interfaces';

@Injectable()
export class SocketService {
	server: Server;
	constructor(
		@Inject('LoggerService') private readonly logger: LoggerService,
		private readonly authService: AuthService,
		private readonly loginLogService: LoginLogService,
		private readonly settingsService: SettingsService,
		private readonly roomService: RoomService,
	) {}

	privateCallEnded(client: SocketWithData) {
		const callerClient = client.data.privateChatting?.callerClient;
		const calledClient = client.data.privateChatting?.calledClient;
		if (callerClient) {
			callerClient.emit(SocketEventType.CALL_ENDED);
			callerClient.data.privateChatting = null;
		}
		if (calledClient) {
			calledClient.emit(SocketEventType.CALL_ENDED);
			calledClient.data.privateChatting = null;
		}
	}

	privateCall(client: SocketWithData, data: { user: IUserForClient }) {
		const calledClient = this.server.sockets.sockets.get(data.user.clientId) as SocketWithData;
		if (calledClient) {
			// TODO: control the called banned the caller
			if (calledClient.data.privateChatting) {
				return 'User is not available';
			} else {
				const privateChatting = {
					caller: client.data.user,
					called: calledClient.data.user,
					callerClient: client,
					calledClient,
				};
				client.data.privateChatting = privateChatting;
				calledClient.data.privateChatting = privateChatting;
				return false;
			}
		}
		return 'User not found';
	}

	updateRoomUserCounts(client: SocketWithData | Server) {
		const rooms = this.server.sockets.adapter.rooms;
		const result: Record<string, number> = {};

		for (const [roomName, room] of rooms.entries()) {
			if (!roomName.includes(process.env.ROOM_POSTFIX)) continue;
			result[roomName.replace(process.env.ROOM_POSTFIX, '')] = room.size;
		}
		client.emit(SocketEventType.ROOM_USER_COUNTS, result);
	}

	updateExtraData(client: SocketWithData, user: IUserForClient) {
		if (user) {
			Object.assign(client.data.user, user);
			this.server.emit(SocketEventType.UPDATE_EXTRA_DATA, client.data.user.getDto());
		}
	}

	async joinRoom(client: SocketWithData, data: { room: IRoom; password: string }) {
		if (!(data && data.room)) return;
		const room = await this.roomService.findOne(data.room.id);
		if (room) {
			if (!room.hasPassword || (room.hasPassword && room.password === data.password)) {
				await this.removeUserFromAllRooms(client);
				const roomName = `${room.id}${process.env.ROOM_POSTFIX}`;
				await client.join(roomName);
				client.emit(SocketEventType.JOIN_ROOM, room);
				this.updateRoomUserCounts(this.server);
			}
		}
	}

	sendMessage(client: SocketWithData, data: ISendMessage) {
		if (data.type === 'ALL_EVENT' || data.type === 'SYSTEM_MESSAGE') {
			this.server.emit(SocketEventType.SEND_MESSAGE, data);
		} else if (data.type === 'ROOM_EVENT' || data.type == 'ROOM_MESSAGE') {
			this.server
				.to(`${client.data.user.room.id}${process.env.ROOM_POSTFIX}`)
				.emit(SocketEventType.SEND_MESSAGE, data);
		} else if (data.type === 'PRIVATE_MESSAGE') {
			const targetClient = this.server.sockets.sockets.get(data.toClientId);
			if (targetClient) {
				targetClient.emit(SocketEventType.SEND_MESSAGE, data);
			}
		} else if (data.type === 'ALL_MESSAGE') {
			if (data.user.permission.canSendToAll) {
				this.server.emit(SocketEventType.SEND_MESSAGE, data);
			}
		}
	}
	getAllUsers(): WsResponse<IUserForClient[]> {
		const rooms = this.server.sockets.adapter.rooms;
		const result: IUserForClient[] = [];

		for (const [roomName, room] of rooms.entries()) {
			if (!roomName.includes(process.env.ROOM_POSTFIX)) continue;

			for (const socketId of room) {
				const socket: SocketWithData = this.server.sockets.sockets.get(socketId);
				if (socket) {
					result.push(socket.data.user);
				}
			}
		}

		return { event: SocketEventType.GET_ALL_USERS, data: result };
	}

	async getIp(client: SocketWithData, data: any) {
		const user = client.data.user;

		if (!user.permission.canSeeIpOfUsers) return;
		const ip = await this.loginLogService.getLatestLoginIpByUsername(data);
		if (ip) {
			return {
				event: SocketEventType.GET_IP,
				data: await this.loginLogService.getLatestLoginIpByUsername(data),
			};
		}
	}

	isIpAlreadyLoggedIn(ip: string): boolean {
		for (const [, socket] of this.server.sockets.sockets) {
			if (socket && socket.data && socket.data.user && socket.data.user.ip === ip) {
				return true;
			}
		}
		return false;
	}

	async removeUserFromAllRooms(client: SocketWithData) {
		for (const r of client.rooms) {
			if (r !== client.id) {
				client.leave(r);
			}
		}
	}

	getUserExtraData(client: SocketWithData) {
		return { id: client.id, data: client.data.user.getDto() };
	}

	async handleConnection(client: SocketWithData) {
		this.logger.log(`Client connected: ${client.id}`);
		const cookies = client.handshake.headers.cookie;

		const user = await this.authService.validateUserFromCookies(cookies);
		if (!user) {
			this.logger.log(`client cookies is not valid`);
			return client.disconnect();
		}

		const ip = client.handshake.address.replace('::ffff:', '');
		const settings = await this.settingsService.getSettings();

		if (!settings.guestLoginActive && user.id === -1) {
			this.logger.log(`guest login attempt while guest login is disabled ip: ${ip}`);
			return client.disconnect();
		}

		if (settings.doubleLoginActive || !this.isIpAlreadyLoggedIn(ip)) {
			const room = await this.roomService.getDefaultRoom();
			const roomName = `${room.id}${process.env.ROOM_POSTFIX}`;
			await client.join(roomName); // should be no password in the default room
			this.updateRoomUserCounts(this.server);

			const username = client.handshake.auth.username;
			const gender = client.handshake.auth.gender;
			if (!username) {
				this.logger.log(`username is not valid`);
				return client.disconnect();
			}

			const userForSocket = new UserForSocket(
				room,
				ip,
				client.id,
				user.id == -1 ? username : user.username,
				gender,
				user.about,
				user.profileImage,
				user.banned,
				user.preventMic,
				user.preventCam,
				user.created,
				user.permission,
				user.preference,
				user.status,
				user.rank,
			);

			client.data.user = userForSocket;
			this.server.emit(SocketEventType.USER_CONNECTED, userForSocket.getDto());
			client.emit(SocketEventType.SET_USER_DATA, userForSocket);

			const msg: ISendMessage = { user: client.data.user, text: 'entered', type: 'ROOM_EVENT' };
			this.server.to(roomName).emit(SocketEventType.SEND_MESSAGE, msg);
		} else {
			client.emit(SocketEventType.DOUBLE_LOGIN);
			this.logger.log(`${ip} double login attempt`);
		}
	}

	handleDisconnect(client: SocketWithData) {
		this.logger.log(`Client disconnected: ${client.id}`);
		if (client.data.user && client.data.user.room) {
			const roomName = `${client.data.user.room.id}${process.env.ROOM_POSTFIX}`;
			const msg: ISendMessage = { user: client.data.user, text: 'leaved', type: 'ROOM_EVENT' };
			this.server.to(roomName).emit(SocketEventType.SEND_MESSAGE, msg);
		}

		this.server.emit(SocketEventType.USER_DISCONNECTED, client.id);
	}
}
