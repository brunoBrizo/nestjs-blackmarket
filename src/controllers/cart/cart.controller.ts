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
import { GetUser } from '@src/decorators/auth';
import { User } from '@entities/auth';
import { AddProductToCartDto } from '@dtos/cart';
import { Cart } from '@entities/cart';
import { CartService } from '@services/cart';

@Controller('cart')
@UseGuards(AuthGuard())
export class CartController {
  constructor(private cartService: CartService) {}

  @HttpCode(200)
  @Post()
  async addProductToCart(
    @Body() addProductToCartDto: AddProductToCartDto,
    @GetUser() user: User
  ): Promise<Cart> {
    return this.cartService.addProductToCart(user, addProductToCartDto);
  }

  @HttpCode(200)
  @Delete('/:productId')
  async removeProductFromCart(
    @Param('productId') productId: string,
    @GetUser() user: User
  ): Promise<void> {
    await this.cartService.removeProductFromCart(user, productId);
  }
}
