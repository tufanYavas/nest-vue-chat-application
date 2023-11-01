import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PeerServer } from 'peer';
import { getOrigins } from '../utils';
import * as fs from 'fs';

@Module({})
export class PeerServerModule implements OnModuleInit {
	constructor(private configService: ConfigService) {}
	onModuleInit() {
		const sslOptions =
			this.configService.get('SSL.CERT_PATH') && this.configService.get('SSL.PRIVKEY_PATH')
				? {
						key: fs.readFileSync(this.configService.get('SSL.PRIVKEY_PATH')).toString('utf-8'),
						cert: fs.readFileSync(this.configService.get('SSL.CERT_PATH')).toString('utf-8'),
				  }
				: undefined;

		const server = PeerServer({
			port: this.configService.getOrThrow<number>('PEER.SERVER.PORT'),
			path: this.configService.getOrThrow<string>('PEER.SERVER.PATH'),
			key: this.configService.getOrThrow<string>('PEER.SERVER.KEY'),
			ssl: sslOptions,
			corsOptions: {
				origin: getOrigins(this.configService, 'PEER.SERVER.CORS.ORIGINS'),
			},
		});
		server.on('connection', (client) => {
			console.log('New peer connected:', client.getId());
		});
	}
}
