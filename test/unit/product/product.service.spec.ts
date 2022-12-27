import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { CreateProductDto, UpdateProductDto } from '@dtos/product';
import { Product } from '@entities/product';
import { ProductService } from '@services/product';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from '@repository/product';

describe('ProductService', () => {
  let productService: ProductService;

  const createProductDto: CreateProductDto = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2))
  };

  const updateProductDto: UpdateProductDto = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2))
  };

  const mockProduct: Product = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent()
  };

  const mockProductRepository = {
    createProduct: jest.fn().mockResolvedValue(mockProduct),
    updateProduct: jest.fn().mockResolvedValue(mockProduct),
    deleteProduct: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(undefined),
    findOneBy: jest.fn().mockResolvedValue(mockProduct)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductRepository),
          useValue: mockProductRepository
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
});
