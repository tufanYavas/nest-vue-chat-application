import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieSession from 'cookie-session';
import { ValidationPipe } from '@nestjs/common';
import { SocketIoAdapter } from './adapters/socket.io.adapter';
import { ConfigService } from '@nestjs/config';
import { getOrigins } from './utils';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);

	app.enableCors({
		origin: getOrigins(configService, 'CORS.ORIGINS'),
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});

	app.useGlobalPipes(new ValidationPipe());

	app.use(
		cookieSession({
			name: 'session',
			keys: [
				'hg1789yhz1jkn12jg1uy2hfg1vzsnb12bl12hj1gf2172fhjv31zfgx1',
				'12htygjh12g1hv3h1d3rfy1f2fcg12d1v1nm b21v42ghfh21vb1nv31',
			],
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: false,
		}),
	);

	app.setGlobalPrefix('api');
	app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
	await app.listen(configService.getOrThrow<number>('API_PORT'));
}
bootstrap();
