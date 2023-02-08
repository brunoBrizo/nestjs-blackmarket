import { SubCategory } from '@entities/subcategory';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth';
import { SubCategoryController } from '@controllers/subcategory';
import { SubCategoryService } from '@services/subcategory';
import { SubCategoryRepository } from '@repository/subcategory';
import { CategoryModule } from '@modules/category';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory]),
    AuthModule,
    CategoryModule
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, SubCategoryRepository],
  exports: [SubCategoryService]
})
export class SubCategoryModule {}
