import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from 'src/transform.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())

  const port = process.env.APP_PORT

  await app.listen(port)
}
bootstrap();
