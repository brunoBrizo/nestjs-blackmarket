import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JwtToken } from './jwt_token.interface';
import { CreateUserDto } from './dto/create_user.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin_user.dto';

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
