import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@entities/product';
import { ProductService } from '@services/product';
import { ProductController } from '@controllers/product';
import { AuthModule } from '@modules/auth';
import { ProductRepository } from '@repository/product';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository]
})
export class ProductModule {}
