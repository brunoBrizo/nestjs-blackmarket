import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

  @HttpCode(HttpStatus.OK)
  @Post()
  async addProductToCart(
    @Body() addProductToCartDto: AddProductToCartDto,
    @GetUser() user: User
  ): Promise<Cart> {
    return this.cartService.addProductToCart(user, addProductToCartDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:productId')
  async removeProductFromCart(
    @Param('productId') productId: string,
    @GetUser() user: User
  ): Promise<void> {
    await this.cartService.removeProductFromCart(user, productId);
  }

  @Get()
  async getCart(@GetUser() user: User): Promise<Cart> {
    return this.cartService.getCart(user);
  }
}
