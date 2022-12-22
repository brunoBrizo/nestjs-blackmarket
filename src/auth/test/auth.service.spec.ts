import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './../user.repository';
import { CreateUserDto } from './../dto/create_user.dto';
import { AuthService } from './../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '../user_type.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AuthService', () => {
  let authService: AuthService;
  const createUserDto: CreateUserDto = {
    email: faker.internet.email(),
    name: faker.internet.userName(),
    password: faker.internet.password(),
    type: UserType.ADMIN
  };

  const mockUserRepository = {
    createUser: jest.fn().mockImplementation(user =>
      Promise.resolve({
        id: faker.datatype.uuid(),
        ...user
      })
    )
  };

  const mockJwtService = {
    signAsync: jest
      .fn()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation(_payload => Promise.resolve('usertoken'))
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository
        },
        JwtService
      ]
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should get a user token', async () => {
    const result = await authService.signUp(createUserDto);

    expect(result.token).not.toBeNull();
    expect(result).toEqual({
      token: expect.any(String)
    });
  });
});
