import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UserController } from '@controllers/user';
import { AddFavoriteProductDto } from '@dtos/user';
import { UserType } from '@enums/auth';
import { User } from '@entities/auth';
import { UserService } from '@services/user';
import { Product } from '@entities/product';

describe('UserController', () => {
  let userController: UserController;
  const productId = faker.datatype.uuid();

  const addFavoriteProductDto: AddFavoriteProductDto = {
    productId
  };

  const mockProduct: Product = {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    category: null,
    subCategory: null,
    users: []
  };

  const mockUser: User = {
    id: faker.datatype.uuid(),
    email: 'bbrizolara7@gmail.com',
    name: faker.name.firstName(),
    password: '$2b$10$.XdALYSNS4neCmlFS9jxSO5xWVWwJ73cZkAtOl9iQczfbXQgTi2Ce',
    type: UserType.ADMIN,
    favoriteProducts: [mockProduct]
  };

  const mockUserService = {
    addFavoriteProduct: jest.fn().mockResolvedValue(mockUser),
    removeFavoriteProduct: jest.fn().mockResolvedValue(mockUser),
    isFavoriteProduct: jest.fn().mockResolvedValue(mockProduct)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should add a product to user favorites /POST /product ', async () => {
    const result = await userController.addFavoriteProduct(
      addFavoriteProductDto,
      mockUser
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockUser);
  });

  it('should remove a product from user favorites /DELETE /product/:productId ', async () => {
    const result = await userController.deleteProduct(productId, mockUser);

    expect(result).not.toBeNull();
    expect(result).toEqual(mockUser);
  });
});
