import { Category } from '@entities/category';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '@dtos/subcategory';
import { SubCategory } from '@entities/subcategory';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from '@repository/category';
import { SubCategoryRepository } from '@repository/subcategory';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategoryRepository)
    private subCategoryRepository: SubCategoryRepository,
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository
  ) {}

  async createSubCategory(
    createSubCategoryDto: CreateSubCategoryDto
  ): Promise<SubCategory> {
    const { categoryId } = createSubCategoryDto;

    const category = await this.getCategory(categoryId);

    const subCategory = await this.subCategoryRepository.createSubCategory(
      createSubCategoryDto,
      category
    );

    return subCategory;
  }

  async updateSubCategory(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto
  ): Promise<SubCategory> {
    const storedSubCategory = await this.subCategoryRepository.findById(id);
    if (!storedSubCategory) {
      throw new NotFoundException(`SubCategory with id: ${id} was not found`);
    }

    const updatedSubCategory: SubCategory = {
      ...storedSubCategory,
      ...updateSubCategoryDto
    };

    return await this.subCategoryRepository.updateSubCategory(
      updatedSubCategory
    );
  }

  async deleteSubCategory(id: string): Promise<void> {
    const result = await this.subCategoryRepository.deleteSubCategory(id);

    if (result === 0) {
      throw new NotFoundException(`SubCategory with id ${id} not found`);
    }
  }

  private async getCategory(categoryId: string): Promise<Category> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} was not found`);
    }

    return category;
  }
}
