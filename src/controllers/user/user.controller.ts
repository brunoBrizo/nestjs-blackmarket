import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '@services/user';
import { AddFavoriteProductDto } from '@dtos/user';
import { GetUser } from '@src/decorators/auth';
import { User } from '@entities/auth';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(201)
  @Post('/product')
  async addFavoriteProduct(
    @Body() addFavoriteProductDto: AddFavoriteProductDto,
    @GetUser() user: User
  ): Promise<User> {
    return this.userService.addFavoriteProduct(addFavoriteProductDto, user);
  }

  @HttpCode(200)
  @Delete('/product/:productId')
  async deleteProduct(
    @Param('productId') productId: string,
    @GetUser() user: User
  ): Promise<User> {
    return this.userService.removeFavoriteProduct(productId, user);
  }
}
