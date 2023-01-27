import { CategoryRepository } from '@repository/category';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto
} from '@dtos/product';
import { Product } from '@entities/product';
import { ProductService } from '@services/product';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from '@repository/product';
import { Category } from '@entities/category';
import { SubCategory } from '@entities/subcategory';
import { SubCategoryRepository } from '@repository/subcategory';
import { SortProductsCriteria } from '@enums/products';
import { OrderCriteria } from '@enums/order_criteria.enum';

describe('ProductService', () => {
  let productService: ProductService;
  const subCategoryId = faker.datatype.uuid();
  const categoryId = faker.datatype.uuid();

  const createProductDto: CreateProductDto = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    categoryId,
    subCategoryId
  };

  const updateProductDto: UpdateProductDto = {
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2))
  };

  const mockCategory: Category = {
    id: categoryId,
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    products: [],
    subCategories: []
  };

  const mockSubCategory: SubCategory = {
    id: subCategoryId,
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    products: [],
    category: mockCategory
  };

  const mockProduct: Product = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    category: mockCategory,
    subCategory: mockSubCategory,
    users: [],
    cartItems: []
  };

  const mockProductRepository = {
    createProduct: jest.fn().mockResolvedValue(mockProduct),
    updateProduct: jest.fn().mockResolvedValue(mockProduct),
    deleteProduct: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(mockProduct),
    findOneBy: jest.fn().mockResolvedValue(mockProduct),
    findById: jest.fn().mockResolvedValue(mockProduct),
    getAll: jest.fn().mockResolvedValue([mockProduct])
  };

  const mockCategoryRepository = {
    findById: jest.fn().mockResolvedValue(mockCategory)
  };

  const mockSubCategoryRepository = {
    findById: jest.fn().mockResolvedValue(mockSubCategory)
  };

  const getProductsDto: GetProductsDto = {
    take: 1,
    skip: 0,
    sort: SortProductsCriteria.CREATED_AT,
    order: OrderCriteria.ASC,
    search: '',
    categories: [mockCategory.id]
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductRepository),
          useValue: mockProductRepository
        },
        {
          provide: getRepositoryToken(CategoryRepository),
          useValue: mockCategoryRepository
        },
        {
          provide: getRepositoryToken(SubCategoryRepository),
          useValue: mockSubCategoryRepository
        }
      ]
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  it('should create and get a product /POST / ', async () => {
    const result: Product = await productService.createProduct(
      createProductDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockProduct);
  });

  it('should update a product /PUT /:id ', async () => {
    const result: Product = await productService.updateProduct(
      mockProduct.id,
      updateProductDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockProduct);
  });

  it('should delete a product /DELETE /:id ', async () => {
    await expect(productService.deleteProduct(mockProduct.id)).resolves.toBe(
      undefined
    );
  });

  it('should get a list of products /GET / ', async () => {
    const result: Product[] = await productService.getAllProducts(
      getProductsDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual([mockProduct]);
  });
});
