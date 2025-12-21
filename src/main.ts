import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
