import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import client from 'prom-client';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.register(require('@fastify/helmet'));

  // CORS origins from environment
  // const corsOrigins = process.env.CORS_ORIGINS
  //   ? process.env.CORS_ORIGINS.split(',')
  //   : ['http://localhost:3000'];

  // app.enableCors({
  //   origin: corsOrigins,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // });

  // Enhanced validation to prevent NoSQL injection
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  const port = process.env.PORT || 6001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });
