import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth';
import { Cart, CartItem } from '@entities/cart';
import { CartRepository } from '@repository/cart';
import { CartController } from '@controllers/cart';
import { CartService } from '@services/cart';
import { ProductRepository } from '@repository/product';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), AuthModule],
  controllers: [CartController],
  providers: [CartRepository, CartService, ProductRepository]
})
export class CartModule {}
