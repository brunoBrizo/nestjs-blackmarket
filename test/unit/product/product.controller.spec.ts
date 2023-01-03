import { Category } from '@entities/category';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ProductController } from '@controllers/product';
import { CreateProductDto, UpdateProductDto } from '@dtos/product';
import { Product } from '@entities/product';
import { ProductService } from '@services/product';

describe('ProductController', () => {
  let productController: ProductController;

  const createProductDto: CreateProductDto = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    categoryId: faker.datatype.uuid()
  };

  const updateProductDto: UpdateProductDto = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    categoryId: faker.datatype.uuid()
  };

  const mockCategory: Category = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    products: []
  };

  const mockProduct: Product = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    category: mockCategory
  };

  const mockProductService = {
    createProduct: jest.fn().mockResolvedValue(mockProduct),
    updateProduct: jest.fn().mockResolvedValue(mockProduct),
    deleteProduct: jest.fn().mockResolvedValue(undefined)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService]
    })
      .overrideProvider(ProductService)
      .useValue(mockProductService)
      .compile();

    productController = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  it('should create and get a product /POST / ', async () => {
    const result: Product = await productController.createProduct(
      createProductDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockProduct);
  });

  it('should update a product /PUT /:id ', async () => {
    const result: Product = await productController.updateProduct(
      mockProduct.id,
      updateProductDto
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockProduct);
  });

  it('should delete a product /DELETE /:id ', async () => {
    await expect(productController.deleteProduct(mockProduct.id)).resolves.toBe(
      undefined
    );
  });
});
