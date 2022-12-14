import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main App');
  const port = process.env.PORT;

  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  logger.log(`App running on port ${port}`);
}
bootstrap();
