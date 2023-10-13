import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8081',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(
    cookieSession({
      // name: 'session',
      keys: ['key1', 'key2'], // Güvenlik için kullanılan anahtarlar. Gerçek projelerde daha karmaşık anahtarlar kullanmalısınız.
      maxAge: 7 * 24 * 60 * 60 * 1000, // 24 saat
      // sameSite: 'none', // CORS için önemli
      // secure: false, // HTTPS için
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
