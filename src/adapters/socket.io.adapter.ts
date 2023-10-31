import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { getOrigins } from '../utils';

export class SocketIoAdapter extends IoAdapter {
	constructor(
		private app: INestApplicationContext,
		private configService: ConfigService,
	) {
		super(app);
	}

	createIOServer(port: number, options?: ServerOptions) {
		port = this.configService.get<number>('SOCKETIO.SERVER.PORT');
		const path = this.configService.get<string>('SOCKETIO.SERVER.PATH');
		options.path = path;
		options.cors = {
			origin: getOrigins(this.configService, 'SOCKETIO.SERVER.CORS.ORIGINS'),
			methods: ['GET', 'POST'],
			credentials: true,
		};

		const server = super.createIOServer(port, options);
		return server;
	}
}
