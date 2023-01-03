import { CreateCategoryDto, UpdateCategoryDto } from '@dtos/category';
import { CategoryService } from '@services/category';
import { CategoryRepository } from '@repository/category';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '@entities/category';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  const categoryName = faker.commerce.productAdjective();

  const createCategoryDto: CreateCategoryDto = {
    name: categoryName,
    description: faker.commerce.productDescription()
  };

  const updateCategoryDto: UpdateCategoryDto = {
    name: categoryName,
    description: faker.commerce.productDescription()
  };

  const mockCategory: Category = {
    id: faker.datatype.uuid(),
    name: categoryName,
    description: faker.commerce.productDescription(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    products: []
  };

  const mockCategoryRepository = {
    createCategory: jest.fn().mockResolvedValue(mockCategory),
    findByName: jest.fn().mockResolvedValue(mockCategory),
    findById: jest.fn().mockResolvedValue(mockCategory),
    updateCategory: jest.fn().mockResolvedValue(mockCategory),
    deleteCategory: jest.fn().mockResolvedValue(1)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryRepository),
          useValue: mockCategoryRepository
        }
      ]
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  it('should create and get a category /POST / ', async () => {
    const result: Category = await categoryService.createCategory(
      createCategoryDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockCategory);
  });

  it('should update a category /PUT /:id ', async () => {
    const result: Category = await categoryService.updateCategory(
      mockCategory.id,
      updateCategoryDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockCategory);
  });

  it('should delete a category /DELETE /:id ', async () => {
    await expect(categoryService.deleteCategory(mockCategory.id)).resolves.toBe(
      undefined
    );
  });
});
