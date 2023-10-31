import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder.service';
import { AppModule } from '../app/app.module';
import { User } from '../users/entities/user.entity';

declare module 'express-session' {
	export interface SessionData {
		user?: User;
		[key: string]: any;
	}
}

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const seeder = app.get(SeederService);
	await seeder.run();
	await app.close();
	process.exit(0);
}

bootstrap();
