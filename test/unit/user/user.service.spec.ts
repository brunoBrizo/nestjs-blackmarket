import { UserService } from '@services/user';
import { UserRepository } from '@repository/auth';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '@enums/auth';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { User } from '@entities/auth';
import { AddFavoriteProductDto } from '@dtos/user';
import { Product } from '@entities/product';
import { ProductRepository } from '@repository/product';

describe('UserService', () => {
  let userService: UserService;
  const productId = faker.datatype.uuid();

  const addFavoriteProductDto: AddFavoriteProductDto = {
    productId
  };

  const mockProduct: Product = {
    id: productId,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    category: null,
    subCategory: null,
    users: [],
    cartItems: []
  };

  const mockUser: User = {
    id: faker.datatype.uuid(),
    email: 'bbrizolara7@gmail.com',
    name: faker.name.firstName(),
    password: '$2b$10$.XdALYSNS4neCmlFS9jxSO5xWVWwJ73cZkAtOl9iQczfbXQgTi2Ce',
    type: UserType.ADMIN,
    favoriteProducts: [],
    cart: null
  };

  const mockUserWithFavorites: User = {
    id: faker.datatype.uuid(),
    email: 'bbrizolara7@gmail.com',
    name: faker.name.firstName(),
    password: '$2b$10$.XdALYSNS4neCmlFS9jxSO5xWVWwJ73cZkAtOl9iQczfbXQgTi2Ce',
    type: UserType.ADMIN,
    favoriteProducts: [mockProduct],
    cart: null
  };

  const mockUserRepository = {
    loadUserProducts: jest
      .fn()
      .mockResolvedValue([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([mockProduct]),
    findUserByEmail: jest.fn().mockResolvedValue(mockUser),
    saveUser: jest
      .fn()
      .mockResolvedValue([])
      .mockResolvedValueOnce(mockUserWithFavorites)
      .mockResolvedValueOnce(mockUser)
  };

  const mockProductRepository = {
    findById: jest.fn().mockResolvedValue(mockProduct)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository
        },
        {
          provide: getRepositoryToken(ProductRepository),
          useValue: mockProductRepository
        }
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should add a product to user favorites', async () => {
    const result = await userService.addFavoriteProduct(
      addFavoriteProductDto,
      mockUser
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockUserWithFavorites);
  });

  it('should remove a product from user favorites', async () => {
    const result = await userService.removeFavoriteProduct(
      productId,
      mockUserWithFavorites
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockUser);
  });
});
