import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@entities/product';
import { ProductService } from '@services/product';
import { ProductController } from '@controllers/product';
import { AuthModule } from '@modules/auth';
import { ProductRepository } from '@repository/product';
import { SubCategoryModule } from '@modules/subcategory';
import { CategoryModule } from '@modules/category';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    AuthModule,
    SubCategoryModule,
    CategoryModule
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService]
})
export class ProductModule {}
