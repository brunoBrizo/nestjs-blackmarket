import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth';
import { Cart, CartItem } from '@entities/cart';
import { CartRepository } from '@repository/cart';
import { CartController } from '@controllers/cart';
import { CartService } from '@services/cart';
import { ProductModule } from '@modules/product';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    AuthModule,
    ProductModule,
    ThrottlerModule.forRoot({
      limit: 20,
      ttl: 60
    })
  ],
  controllers: [CartController],
  providers: [CartRepository, CartService],
  exports: [CartService]
})
export class CartModule {}
