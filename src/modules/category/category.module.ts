import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth';
import { Category } from '@entities/category';
import { CategoryController } from '@controllers/category';
import { CategoryService } from '@services/category';
import { CategoryRepository } from '@repository/category';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService]
})
export class CategoryModule {}
