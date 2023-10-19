import { Inject, LoggerService } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { SocketEventType } from './socket.enum';
import { LoginLogService } from '../login-log/login-log.service';
import * as RTCMultiConnectionServer from 'rtcmulticonnection-server';
import { IUser } from '../server.interfaces';
import { SettingsService } from '../settings/settings.service';
import { User } from 'src/users/entities/user.entity';

interface SocketWithUser extends Socket {
	data: {
		user: User;
		participantId: string;
	};
}

interface User4Socket extends IUser {
	ip: string;
	participantId: string;
}
@WebSocketGateway(3131, {
	cors: {
		origin: 'http://localhost:8081',
		methods: ['GET', 'POST'],
		credentials: true,
	},
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject('LoggerService') private readonly logger: LoggerService,
		private readonly authService: AuthService,
		private readonly loginLogService: LoginLogService,
		private readonly settingsService: SettingsService,
	) {}
	@WebSocketServer()
	server: Server;
	users: User4Socket[] = [];

	@SubscribeMessage(SocketEventType.GET_IP)
	async getIp(@ConnectedSocket() client: SocketWithUser, @MessageBody() data: any): Promise<WsResponse> {
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	afterInit(server: Server) {
		this.logger.log('WebSocket Initialized!');
	}

	async handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
		const cookies = client.handshake.headers.cookie;

		const user = await this.authService.validateUserFromCookies(cookies);
		if (!user) {
			this.logger.log(`client cookies is not valid`);
			return client.disconnect();
		}

		const participantId = client.handshake.query.userid as string;
		client.data.user = user;
		client.data.participantId = participantId;

		const ip = client.handshake.address;

		const settings = await this.settingsService.getSettings();
		const matchedUser = this.users.find((u) => u.ip == ip);

		if (settings.doubleLoginActive || !matchedUser) {
			this.users.push({
				...(user as unknown as IUser),
				ip,
				participantId: client.id,
			});
			RTCMultiConnectionServer.addSocket(client);
		} else {
			client.emit(SocketEventType.DOUBLE_LOGIN);
			this.logger.log(`${ip} double login attempt`);
		}
	}

	handleDisconnect(client: SocketWithUser) {
		this.logger.log(`Client disconnected: ${client.id}`);
		this.users = this.users.filter((user) => user.participantId !== client.id);
	}
}
