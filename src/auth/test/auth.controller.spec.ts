import { CreateUserDto } from './../dto/create_user.dto';
import { AuthService } from './../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './../auth.controller';
import { UserType } from '../user_type.enum';

describe('AuthController', () => {
  let authController: AuthController;
  const createUserDto: CreateUserDto = {
    email: 'bbrizolara7@gmail.com',
    name: 'Bruno',
    password: 'Bruno123!',
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

  beforeEach(async () => {
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
