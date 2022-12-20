import { CreateUserDto } from '../src/auth/dto/create_user.dto';
import { UserRepository } from '../src/auth/user.repository';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserType } from '../src/auth/user_type.enum';

describe('App (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {
    createUser: jest.fn().mockImplementation(user =>
      Promise.resolve({
        id: '123',
        ...user
      })
    )
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
    const mockUser: CreateUserDto = {
      email: 'bbrizolara7@gmail.com',
      name: 'Bruno',
      password: 'Bruno123!',
      type: UserType.ADMIN
    };

    it('should get a user token', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockUser)
        .expect(201);

      expect(result.body).toEqual({
        token: expect.any(String)
      });
    });

    it('should get a password validation error', async () => {
      const mockUser = {
        email: 'bbrizolara7@gmail.com',
        name: 'Bruno',
        password: 'bruno',
        type: 'ADMIN'
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

    it('should get an email validation error', async () => {
      const mockUser = {
        email: 'bbrizolara7@gmail',
        name: 'Bruno',
        password: 'Bruno123!',
        type: 'ADMIN'
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
  });

  afterAll(async () => {
    await app.close();
  });
});
