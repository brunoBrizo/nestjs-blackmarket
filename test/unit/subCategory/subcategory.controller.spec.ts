import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { SubCategoryController } from '@controllers/subcategory';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '@dtos/subcategory';
import { Category } from '@entities/category';
import { SubCategory } from '@entities/subcategory';
import { SubCategoryService } from '@services/subcategory';

describe('SubCategoryController', () => {
  let subCategoryController: SubCategoryController;

  const createSubCategoryDto: CreateSubCategoryDto = {
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    categoryId: faker.datatype.uuid()
  };

  const updateSubCategoryDto: UpdateSubCategoryDto = {
    description: faker.commerce.productDescription()
  };

  const mockCategory: Category = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    products: [],
    subCategories: []
  };

  const mockSubCategory: SubCategory = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    products: [],
    category: mockCategory
  };

  const mockSubCategoryService = {
    createSubCategory: jest.fn().mockResolvedValue(mockSubCategory),
    updateSubCategory: jest.fn().mockResolvedValue(mockSubCategory),
    deleteSubCategory: jest.fn().mockResolvedValue(undefined)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoryController],
      providers: [SubCategoryService]
    })
      .overrideProvider(SubCategoryService)
      .useValue(mockSubCategoryService)
      .compile();

    subCategoryController = module.get<SubCategoryController>(
      SubCategoryController
    );
  });

  it('should be defined', () => {
    expect(subCategoryController).toBeDefined();
  });

  it('should create and get a subCategory /POST / ', async () => {
    const result: SubCategory = await subCategoryController.createSubCategory(
      createSubCategoryDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockSubCategory);
  });

  it('should update a subCategory /PUT /:id ', async () => {
    const result: SubCategory = await subCategoryController.updateSubCategory(
      mockSubCategory.id,
      updateSubCategoryDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockSubCategory);
  });

  it('should delete a subCategory /DELETE /:id ', async () => {
    await expect(
      subCategoryController.deleteSubCategory(mockSubCategory.id)
    ).resolves.toBe(undefined);
  });
});
