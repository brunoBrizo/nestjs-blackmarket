import { AuthService } from '@services/auth';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@controllers/auth';
import { UserType } from '@enums/auth';
import { faker } from '@faker-js/faker';
import { SignInUserDto, CreateUserDto } from '@dtos/auth';

describe('AuthController', () => {
  let authController: AuthController;
  const createUserDto: CreateUserDto = {
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password: faker.internet.password(),
    type: UserType.ADMIN
  };

  const signInUserDto: SignInUserDto = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  const mockAuthService = {
    signUp: jest.fn().mockResolvedValue({
      token: 'usertoken'
    }),
    signIn: jest.fn().mockResolvedValue({
      token: 'usertoken'
    })
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService]
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should get a user token /POST /signup ', async () => {
    const result = await authController.signUp(createUserDto);

    expect(result.token).not.toBeNull();
    expect(result).toEqual({
      token: expect.any(String)
    });
  });

  it('should get a user token /POST /signin ', async () => {
    const result = await authController.signIn(signInUserDto);

    expect(result.token).not.toBeNull();
    expect(result).toEqual({
      token: expect.any(String)
    });
  });
});
