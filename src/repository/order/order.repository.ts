import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { User } from '@entities/auth';
import { Order } from '@entities/order';

@Injectable()
export class OrderRepository extends Repository<Order> {
  private logger: Logger = new Logger('OrderRepository', {
    timestamp: true
  });
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async findByUser(user: User): Promise<Order> {
    try {
      return await this.findOneBy({ user });
    } catch (error) {
      this.logger.error(`Error getting an order by User`, error);
      throw new InternalServerErrorException();
    }
  }

  async saveOrder(order: Order): Promise<Order> {
    try {
      await this.save(order);
      return order;
    } catch (error) {
      this.logger.error(
        `Error saving an order. Order id: ${order.id}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
