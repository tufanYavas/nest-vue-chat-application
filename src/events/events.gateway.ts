import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketEventType } from './socket.enum';
import { ISendMessage, SocketWithData } from './interfaces';
import { EventsService } from './events.service';
import { IRoom, IUser, IUserForClient } from '../common/server.interfaces';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private socketService: EventsService) {
		this.socketService.server = this.server;
	}

	@WebSocketServer()
	server: Server;

	userUpdated(user: IUser) {
		this.server.emit(SocketEventType.USER_UPDATED, user);
	}

	roomUpdated(room: IRoom) {
		this.server.emit(SocketEventType.ROOM_UPDATED, room);
	}

	@SubscribeMessage(SocketEventType.SETTINGS_UPDATED)
	async settingsUpdated() {
		this.socketService.settingsUpdated();
	}

	@SubscribeMessage(SocketEventType.RESET_CHAT_FOR_ALL)
	async resetChatForAll(@ConnectedSocket() client: SocketWithData) {
		if (client.data.user && client.data.user.permission.canResetChatForAll) {
			this.server.emit(SocketEventType.RESET_CHAT_FOR_ALL);
		}
	}

	@SubscribeMessage(SocketEventType.CALL_ENDED)
	async privateCallEnded(@ConnectedSocket() client: SocketWithData) {
		return this.socketService.privateCallEnded(client);
	}

	@SubscribeMessage(SocketEventType.PRIVATE_CALL)
	async privateCall(@ConnectedSocket() client: SocketWithData, @MessageBody() data: { user: IUserForClient }) {
		return this.socketService.privateCall(client, data);
	}

	@SubscribeMessage(SocketEventType.ROOM_USER_COUNTS)
	async updateRoomUserCounts(@ConnectedSocket() client: SocketWithData) {
		return this.socketService.updateRoomUserCounts(client);
	}

	@SubscribeMessage(SocketEventType.JOIN_ROOM)
	async joinRoom(
		@ConnectedSocket() client: SocketWithData,
		@MessageBody() data: { room: IRoom; password: string | null },
	) {
		return this.socketService.joinRoom(client, data);
	}

	@SubscribeMessage(SocketEventType.GET_IP)
	async getIp(@ConnectedSocket() client: SocketWithData, @MessageBody() data: any): Promise<WsResponse> {
		return this.socketService.getIp(client, data);
	}

	@SubscribeMessage(SocketEventType.SEND_MESSAGE)
	sendMessage(@ConnectedSocket() client: SocketWithData, @MessageBody() data: ISendMessage) {
		if (data && (data.text || data.contentType)) this.socketService.sendMessage(client, data);
	}

	@SubscribeMessage(SocketEventType.UPDATE_EXTRA_DATA)
	updateExtraData(@ConnectedSocket() client: SocketWithData, @MessageBody() user: IUserForClient) {
		this.socketService.updateExtraData(client, user);
	}

	@SubscribeMessage(SocketEventType.GET_ALL_USERS)
	getAllUsers(): WsResponse<IUserForClient[]> {
		return this.socketService.getAllUsers();
	}

	async handleConnection(client: SocketWithData) {
		if (!this.socketService.server) this.socketService.server = this.server;
		this.socketService.handleConnection(client);
	}

	handleDisconnect(client: SocketWithData) {
		this.socketService.handleDisconnect(client);
	}
}
