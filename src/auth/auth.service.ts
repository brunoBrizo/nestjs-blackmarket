import { JwtPayload } from './jwt-payload.interface';
import { JwtToken } from './jwt_token.interface';
import { CreateUserDto } from './dto/create_user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { hashUserPassword } from './utils/password_helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<JwtToken> {
    createUserDto.password = await hashUserPassword(createUserDto.password);

    const user = await this.userRepository.createUser(createUserDto);

    const payload: JwtPayload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { token } as JwtToken;
  }
}
