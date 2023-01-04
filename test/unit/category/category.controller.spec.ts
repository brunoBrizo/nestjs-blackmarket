import { CategoryService } from '@services/category';
import { CreateCategoryDto, UpdateCategoryDto } from '@dtos/category';
import { CategoryController } from '@controllers/category';
import { Category } from '@entities/category';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

describe('CategoryController', () => {
  let categoryController: CategoryController;

  const createCategoryDto: CreateCategoryDto = {
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription()
  };

  const updateCategoryDto: UpdateCategoryDto = {
    description: faker.commerce.productDescription()
  };

  const mockCategory: Category = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    products: []
  };

  const mockCategoryService = {
    createCategory: jest.fn().mockResolvedValue(mockCategory),
    updateCategory: jest.fn().mockResolvedValue(mockCategory),
    deleteCategory: jest.fn().mockResolvedValue(undefined)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService]
    })
      .overrideProvider(CategoryService)
      .useValue(mockCategoryService)
      .compile();

    categoryController = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
  });

  it('should create and get a category /POST / ', async () => {
    const result: Category = await categoryController.createCategory(
      createCategoryDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockCategory);
  });

  it('should update a category /PUT /:id ', async () => {
    const result: Category = await categoryController.updateCategory(
      mockCategory.id,
      updateCategoryDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockCategory);
  });

  it('should delete a category /DELETE /:id ', async () => {
    await expect(
      categoryController.deleteCategory(mockCategory.id)
    ).resolves.toBe(undefined);
  });
});
