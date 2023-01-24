import { validationPipeOptions } from '@shared/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@shared/interceptors';

async function bootstrap() {
  const logger = new Logger('Main App');
  const port = process.env.PORT;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);

  logger.log(`App running on port ${port}`);
}

bootstrap();
