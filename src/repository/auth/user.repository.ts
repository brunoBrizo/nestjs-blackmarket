import { CreateUserDto } from '@dtos/auth';
import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { User } from '@entities/auth';
import { ErrorCodes } from '@enums/error_codes.enum';
import { UserType } from '@enums/auth';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger: Logger = new Logger('UserRepository', { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password, type } = createUserDto;

    const user = this.create({
      email,
      name,
      password,
      type
    });

    try {
      await this.save(user);

      if (user.type === UserType.ADMIN) {
        this.logger.verbose(`Created ADMIN user ${user.email}`);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Error creating user. User email: ${user.email}`,
        error.stack
      );
      if (error.code === ErrorCodes.DB_DUPLICATE_VALUE) {
        throw new ConflictException('Email already in use');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.findOneBy({ email });

      return user;
    } catch (error) {
      this.logger.error(
        `Error finding user by email. User email: ${email}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
