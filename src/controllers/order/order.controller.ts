import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/decorators/auth';
import { User } from '@entities/auth';
import { OrderService } from '@services/order';
import { Order } from '@entities/order';
import { CreateOrderDto } from '@dtos/order';

@Controller('order')
@UseGuards(AuthGuard())
export class OrderController {
  constructor(private orderService: OrderService) {}

  @HttpCode(200)
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User
  ): Promise<Order> {
    return this.orderService.createOrder(user, createOrderDto);
  }
}
