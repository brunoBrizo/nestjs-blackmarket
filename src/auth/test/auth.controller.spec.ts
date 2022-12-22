import { CreateUserDto } from './../dto/create_user.dto';
import { AuthService } from './../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './../auth.controller';
import { UserType } from '../user_type.enum';
import { faker } from '@faker-js/faker';

describe('AuthController', () => {
  let authController: AuthController;
  const createUserDto: CreateUserDto = {
    email: faker.internet.email(),
    name: faker.internet.userName(),
    password: faker.internet.password(),
    type: UserType.ADMIN
  };
  const mockAuthService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signUp: jest.fn(_createUserDto => {
      return {
        token: 'usertoken'
      };
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

  it('should get a user token', async () => {
    const result = await authController.signUp(createUserDto);

    expect(result.token).not.toBeNull();
    expect(result).toEqual({
      token: expect.any(String)
    });
  });
});
