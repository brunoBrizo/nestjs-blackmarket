import { OrderController } from '@controllers/order';
import { Order, OrderItem } from '@entities/order';
import { AuthModule } from '@modules/auth';
import { ProductModule } from '@modules/product';
import { StripeModule } from '@modules/stripe';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@repository/auth';
import { CartRepository } from '@repository/cart';
import { OrderRepository } from '@repository/order';
import { OrderService } from '@services/order';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    AuthModule,
    ProductModule,
    StripeModule
  ],
  controllers: [OrderController],
  providers: [OrderRepository, CartRepository, OrderService, UserRepository]
})
export class OrderModule {}
