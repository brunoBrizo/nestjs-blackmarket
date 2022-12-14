import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import typeOrmConfig from './config/typeorm.config';
import configModuleOptions from './config/config_module.config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmConfig)
  ]
})
export class AppModule {}
