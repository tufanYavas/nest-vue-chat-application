import { Inject, LoggerService } from '@nestjs/common';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway(3131, {
	cors: {
		origin: 'http://localhost:8081',
		methods: ['GET', 'POST'],
		// allowedHeaders: ['my-custom-header'],
		credentials: true,
	},
})
export class EventsGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		@Inject('LoggerService') private readonly logger: LoggerService,
		private readonly authService: AuthService,
	) {}
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('events')
	findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
		return from([1, 2, 3]).pipe(
			map((item) => ({ event: 'events', data: item })),
		);
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}

	afterInit(server: Server) {
		this.logger.log('WebSocket Initialized!');
	}

	async handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(
			`Client connected: ${client.id} args: ${args.join(', ')}`,
		);
		const cookies = client.handshake.headers.cookie;
		this.logger.log('cookies=' + cookies);
		this.logger.log(
			'is valid=' + (await this.authService.isValidSession(cookies)),
		);
		// Cookie'leri parse edin ve oturum bilgisini doğrulayın
		if (!(await this.authService.isValidSession(cookies))) {
			this.logger.log(`cookie=${cookies} is not valid`);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('messageToServer')
	handleMessage(client: Socket, text: string): void {
		this.server.emit('messageToClient', text);
	}
}
