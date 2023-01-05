import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubCategoryService } from '@services/subcategory';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '@dtos/subcategory';
import { Category } from '@entities/category';
import { SubCategory } from '@entities/subcategory';
import { SubCategoryRepository } from '@repository/subcategory';
import { CategoryRepository } from '@repository/category';

describe('SubCategoryService', () => {
  let subCategoryService: SubCategoryService;
  const name = faker.commerce.productAdjective();
  const description = faker.commerce.productDescription();

  const createSubCategoryDto: CreateSubCategoryDto = {
    name,
    description,
    categoryId: faker.datatype.uuid()
  };

  const updateSubCategoryDto: UpdateSubCategoryDto = {
    description
  };

  const mockCategory: Category = {
    id: faker.datatype.uuid(),
    name,
    description,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    products: [],
    subCategories: []
  };

  const mockSubCategory: SubCategory = {
    id: faker.datatype.uuid(),
    name,
    description,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    products: [],
    category: mockCategory
  };

  const mockSubCategoryRepository = {
    createSubCategory: jest.fn().mockResolvedValue(mockSubCategory),
    findById: jest.fn().mockResolvedValue(mockSubCategory),
    updateSubCategory: jest.fn().mockResolvedValue(mockSubCategory),
    deleteSubCategory: jest.fn().mockResolvedValue(1)
  };

  const mockCategoryRepository = {
    findById: jest.fn().mockResolvedValue(mockCategory)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoryService,
        {
          provide: getRepositoryToken(SubCategoryRepository),
          useValue: mockSubCategoryRepository
        },
        {
          provide: getRepositoryToken(CategoryRepository),
          useValue: mockCategoryRepository
        }
      ]
    }).compile();

    subCategoryService = module.get<SubCategoryService>(SubCategoryService);
  });

  it('should be defined', () => {
    expect(subCategoryService).toBeDefined();
  });

  it('should create and get a subCategory /POST / ', async () => {
    const result: SubCategory = await subCategoryService.createSubCategory(
      createSubCategoryDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockSubCategory);
  });

  it('should update a subCategory /PUT /:id ', async () => {
    const result: SubCategory = await subCategoryService.updateSubCategory(
      mockSubCategory.id,
      updateSubCategoryDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockSubCategory);
  });

  it('should delete a subCategory /DELETE /:id ', async () => {
    await expect(
      subCategoryService.deleteSubCategory(mockSubCategory.id)
    ).resolves.toBe(undefined);
  });
});
