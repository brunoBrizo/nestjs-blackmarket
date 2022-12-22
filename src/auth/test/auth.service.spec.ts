import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './../user.repository';
import { CreateUserDto } from './../dto/create_user.dto';
import { AuthService } from './../auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '../user_type.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { SignInUserDto } from '../dto/signin_user.dto';
import { User } from './../user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  const createUserDto: CreateUserDto = {
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password: faker.internet.password(),
    type: UserType.ADMIN
  };

  const mockUser: User = {
    id: faker.datatype.uuid(),
    email: 'bbrizolara7@gmail.com',
    name: faker.name.firstName(),
    password: '$2b$10$.XdALYSNS4neCmlFS9jxSO5xWVWwJ73cZkAtOl9iQczfbXQgTi2Ce',
    type: UserType.ADMIN
  };

  const signInUserDto: SignInUserDto = {
    email: 'bbrizolara7@gmail.com',
    password: 'Bruno123!'
  };

  const mockUserRepository = {
    createUser: jest.fn().mockResolvedValue(user => ({
      id: faker.datatype.uuid(),
      ...user
    })),
    findUserByEmail: jest.fn().mockResolvedValue(mockUser)
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('usertoken')
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

  it('should get a user token /signUp', async () => {
    const result = await authService.signUp(createUserDto);

    expect(result.token).not.toBeNull();
    expect(result).toEqual({
      token: expect.any(String)
    });
  });

  it('should get a user token /signIn', async () => {
    const result = await authService.signIn(signInUserDto);

    expect(result.token).not.toBeNull();
    expect(result).toEqual({
      token: expect.any(String)
    });
  });

  it('should throw Unauthorized exception /signIn', async () => {
    signInUserDto.password = faker.internet.password();

    await expect(() => authService.signIn(signInUserDto)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
