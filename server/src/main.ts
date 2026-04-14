import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { env } from './config/env';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin,
    credentials: true,
  });
  app.useStaticAssets(join(process.cwd(), env.assets.uploadsDir), {
    prefix: '/uploads/',
  });

  await app.listen(env.port);
  console.log(`SaaS Clinico Server running on: http://localhost:${env.port}/api`);
}

bootstrap();
