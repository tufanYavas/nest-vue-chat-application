import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieSession from 'cookie-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: 'http://localhost:8081',
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
			maxAge: 7 * 24 * 60 * 60 * 1000, // 24 saat
			// sameSite: 'none', // CORS için önemli
			secure: false, // HTTPS için
		}),
	);

	app.setGlobalPrefix('api');
	await app.listen(3000);
}
bootstrap();
