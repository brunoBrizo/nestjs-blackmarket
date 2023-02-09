import { validationPipeOptions } from '@shared/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  ResponseTimeInterceptor,
  TransformInterceptor
} from '@shared/interceptors';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Main App');
  const port = process.env.PORT;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new ResponseTimeInterceptor());
  await app.listen(port);

  logger.log(`App running on port ${port}`);
}

bootstrap();
