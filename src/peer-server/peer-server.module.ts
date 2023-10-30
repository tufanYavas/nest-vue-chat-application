import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PeerServer } from 'peer';
import { getOrigins } from 'src/utils';

@Module({})
export class PeerServerModule implements OnModuleInit {
	constructor(private configService: ConfigService) {}
	onModuleInit() {
		const server = PeerServer({
			port: this.configService.getOrThrow<number>('PEER.SERVER.PORT'),
			path: this.configService.getOrThrow<string>('PEER.SERVER.PATH'),
			key: this.configService.getOrThrow<string>('PEER.SERVER.KEY'),
			corsOptions: {
				origin: getOrigins(this.configService, 'PEER.SERVER.CORS.ORIGINS'),
			},
		});

		server.on('connection', (client) => {
			console.log('New peer connected:', client.getId());
		});
	}
}
