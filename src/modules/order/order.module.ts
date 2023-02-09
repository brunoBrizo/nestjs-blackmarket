import { OrderController } from '@controllers/order';
import { Order, OrderItem } from '@entities/order';
import { AuthModule } from '@modules/auth';
import { CartModule } from '@modules/cart';
import { ProductModule } from '@modules/product';
import { StripeModule } from '@modules/stripe';
import { UserModule } from '@modules/user';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from '@repository/order';
import { OrderService } from '@services/order';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    AuthModule,
    ProductModule,
    UserModule,
    CartModule,
    StripeModule
  ],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService]
})
export class OrderModule {}
