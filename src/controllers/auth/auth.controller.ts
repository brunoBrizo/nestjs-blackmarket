import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JwtToken } from '@interfaces/auth';
import { AuthService } from '@services/auth';
import { CreateUserDto, SignInUserDto } from '@dtos/auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<JwtToken> {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(200)
  @Post('/signin')
  signIn(@Body() signInUserDto: SignInUserDto): Promise<JwtToken> {
    return this.authService.signIn(signInUserDto);
  }
}
