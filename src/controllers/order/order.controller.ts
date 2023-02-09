import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/decorators/auth';
import { User } from '@entities/auth';
import { OrderService } from '@services/order';
import { Order } from '@entities/order';
import { CreateOrderDto } from '@dtos/order';
import Stripe from 'stripe';
import { HttpStatus } from '@nestjs/common/enums';
import { Throttle } from '@nestjs/throttler';

@Controller('order')
@UseGuards(AuthGuard())
export class OrderController {
  constructor(private orderService: OrderService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Throttle(10, 60)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User
  ): Promise<Order> {
    return this.orderService.createOrder(user, createOrderDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('stripe_webhook')
  @Throttle(10, 60)
  async stripeWebhook(@Body() event: Stripe.Event): Promise<void> {
    return this.orderService.updatePaymentStatus(event);
  }
}
