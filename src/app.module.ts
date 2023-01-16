import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth';
import { typeOrmConfig } from '@shared/config';
import { configModuleOptions } from '@shared/config';
import { ProductModule } from '@modules/product';
import { CategoryModule } from '@modules/category';
import { SubCategoryModule } from '@modules/subcategory';
import { UserModule } from '@modules/user';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    ProductModule,
    CategoryModule,
    SubCategoryModule,
    UserModule
  ]
})
export class AppModule {}
