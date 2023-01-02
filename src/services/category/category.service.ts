import { CreateCategoryDto, UpdateCategoryDto } from '@dtos/category';
import { Category } from '@entities/category';
import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from '@repository/category';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const category = await this.categoryRepository.createCategory(
      createCategoryDto
    );

    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    const storedCategory = await this.categoryRepository.findById(id);
    if (!storedCategory) {
      throw new NotFoundException(`Category with id: ${id} was not found`);
    }

    const { name } = updateCategoryDto;

    if (name !== storedCategory.name) {
      const categoryExists = await this.categoryRepository.findByName(name);
      if (categoryExists) {
        throw new ConflictException('Category name already in use');
      }
    }

    const updatedCategory = { ...storedCategory, ...updateCategoryDto };
    return this.categoryRepository.updateCategory(updatedCategory);
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryRepository.deleteCategory(id);

    if (result === 0) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }
}
