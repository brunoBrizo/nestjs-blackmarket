import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './../user.repository';
import { CreateUserDto } from './../dto/create_user.dto';
import { AuthService } from './../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '../user_type.enum';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  const createUserDto: CreateUserDto = {
    email: 'bbrizolara7@gmail.com',
    name: 'Bruno',
    password: 'Bruno123!',
    type: UserType.ADMIN
  };

  const mockUserRepository = {
    createUser: jest.fn().mockImplementation(user =>
      Promise.resolve({
        id: '123',
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

  beforeEach(async () => {
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
