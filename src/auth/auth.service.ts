import { User } from './user.entity';
import { CreateUserDto } from './dto/create_user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.hashUserPassword(
      createUserDto.password
    );
    const user = await this.userRepository.createUser(createUserDto);

    return user;
  }

  private async hashUserPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}
