import { CreateUserDto } from '@auth/dto/create_user.dto';
import { UserRepository } from '@auth/user.repository';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { UserType } from '@auth/user_type.enum';
import { faker } from '@faker-js/faker';
import { SignInUserDto } from '@auth/dto/signin_user.dto';
import { User } from '@auth/user.entity';

describe('App (e2e)', () => {
  let app: INestApplication;

  const mockUser: User = {
    id: faker.datatype.uuid(),
    email: 'bbrizolara7@gmail.com',
    name: faker.internet.userName(),
    password: '$2b$10$.XdALYSNS4neCmlFS9jxSO5xWVWwJ73cZkAtOl9iQczfbXQgTi2Ce',
    type: UserType.ADMIN
  };

  const mockUserRepository = {
    createUser: jest.fn().mockImplementation(user =>
      Promise.resolve({
        id: faker.datatype.uuid(),
        ...user
      })
    ),
    findUserByEmail: jest.fn().mockResolvedValue(mockUser)
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('AuthModule', () => {
    const mockUserDTO: CreateUserDto = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      password: faker.internet.password(),
      type: UserType.ADMIN
    };

    it('should get a user token /POST /auth/signup', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUserDTO)
        .expect(201);

      expect(result.body).toEqual({
        token: expect.any(String)
      });
    });

    it('should get a password validation error /POST /auth/signup', async () => {
      const mockUser = {
        email: faker.internet.email(),
        name: faker.name.firstName(),
        password: 'bruno',
        type: UserType.ADMIN
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUser)
        .expect(400, {
          statusCode: 400,
          message: [
            'Password must have upper and lower case letters, at least 1 number or special character',
            'password must be longer than or equal to 8 characters'
          ],
          error: 'Bad Request'
        });
    });

    it('should get an email validation error /POST /auth/signup', async () => {
      const mockUser = {
        email: 'bbrizolara@gmail',
        name: faker.name.firstName(),
        password: 'Bruno123!',
        type: UserType.ADMIN
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUser)
        .expect(400, {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request'
        });
    });

    it('should get a user token /POST /auth/signin', async () => {
      const mockSignInUserDto: SignInUserDto = {
        email: 'bbrizolara7@gmail.com',
        password: 'Bruno123!'
      };

      const result = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(mockSignInUserDto)
        .expect(200);

      expect(result.body).toEqual({
        token: expect.any(String)
      });
    });

    it('should get a 401 Unauthorized error /POST /auth/signin', async () => {
      const mockSignInUserDto: SignInUserDto = {
        email: 'bbrizolara7@gmail.com',
        password: 'Bruno'
      };

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send(mockSignInUserDto)
        .expect(401, {
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized'
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
