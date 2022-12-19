import { User } from './user.entity';
import { CreateUserDto } from './dto/create_user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { hashUserPassword } from '../shared/utils/password_helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await hashUserPassword(createUserDto.password);
    const user = await this.userRepository.createUser(createUserDto);

    return user;
  }
}
