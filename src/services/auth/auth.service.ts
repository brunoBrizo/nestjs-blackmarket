import { JwtPayload } from '@interfaces/auth';
import { JwtToken } from '@interfaces/auth';
import { CreateUserDto, SignInUserDto } from '@dtos/auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@repository/auth';
import { JwtService } from '@nestjs/jwt';
import { hashUserPassword, comparePassword } from '@shared/utils';

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
    const token = await this.generateToken({ email: user.email });

    return token;
  }

  async signIn(signInUserDto: SignInUserDto): Promise<JwtToken> {
    const { email, password } = signInUserDto;
    let authenticated = false;

    const user = await this.userRepository.findUserByEmail(email);
    if (user) {
      const validPassword = await comparePassword(password, user.password);
      if (validPassword) {
        authenticated = true;
      }
    }

    if (!authenticated) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken({ email });

    return token;
  }

  private generateToken = async (payload: JwtPayload): Promise<JwtToken> => {
    const token = await this.jwtService.signAsync(payload);

    return { token } as JwtToken;
  };
}
