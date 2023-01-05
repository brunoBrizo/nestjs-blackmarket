import { SubCategory } from '@entities/subcategory';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth';
import { SubCategoryController } from '@controllers/subcategory';
import { SubCategoryService } from '@services/subcategory';
import { CategoryRepository } from '@repository/category';
import { SubCategoryRepository } from '@repository/subcategory';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory]), AuthModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, SubCategoryRepository, CategoryRepository]
})
export class SubCategoryModule {}
