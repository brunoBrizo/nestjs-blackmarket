import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import typeOrmConfig from '@shared/config/typeorm.config';
import configModuleOptions from '@shared/config/config_module.config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule
  ]
})
export class AppModule {}
