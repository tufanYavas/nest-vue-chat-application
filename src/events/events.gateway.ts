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
import { Socket, Server } from 'socket.io';
import { SocketEventType } from './socket.enum';
import { ISendMessage, SocketWithData } from './interfaces';
import { SocketService } from './socket.service';
import { IUserForClient } from 'src/server.interfaces';

@WebSocketGateway(3131, {
	cors: {
		origin: 'http://localhost:8081',
		methods: ['GET', 'POST'],
		credentials: true,
	},
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private socketService: SocketService) {
		this.socketService.server = this.server;
	}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage(SocketEventType.GET_IP)
	async getIp(@ConnectedSocket() client: SocketWithData, @MessageBody() data: any): Promise<WsResponse> {
		return this.socketService.getIp(client, data);
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(client: Socket, room: string): void {
		client.join(room);
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(client: Socket, room: string): void {
		client.leave(room);
	}

	@SubscribeMessage('sendMessageToRoom')
	handleSendMessageToRoom(client: Socket, payload: { room: string; message: string }): void {
		this.server.to(payload.room).emit('newMessage', payload.message);
	}

	@SubscribeMessage('sendMessageToAll')
	handleSendMessageToAll(client: Socket, message: string): void {
		this.server.emit('newMessage', message);
	}

	@SubscribeMessage(SocketEventType.SEND_MESSAGE)
	sendMessage(@ConnectedSocket() client: SocketWithData, @MessageBody() data: ISendMessage) {
		if (data && data.text) return this.socketService.sendMessage(client, data);
	}

	@SubscribeMessage(SocketEventType.UPDATE_EXTRA_DATA)
	updateExtraData(@ConnectedSocket() client: SocketWithData, @MessageBody() user: IUserForClient) {
		if (user) {
			Object.assign(client.data.user, user);
			return this.server.emit(SocketEventType.UPDATE_EXTRA_DATA, client.data.user.getDto());
		}
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
