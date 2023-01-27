import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { Cart } from '@entities/cart';
import { User } from '@entities/auth';

@Injectable()
export class CartRepository extends Repository<Cart> {
  private logger: Logger = new Logger('CartRepository', {
    timestamp: true
  });
  constructor(private dataSource: DataSource) {
    super(Cart, dataSource.createEntityManager());
  }

  async findByUser(user: User): Promise<Cart> {
    try {
      return await this.findOneBy({ user });
    } catch (error) {
      this.logger.error(`Error getting a cart by User`, error);
      throw new InternalServerErrorException();
    }
  }

  async saveCart(cart: Cart): Promise<Cart> {
    try {
      await this.save(cart);
      return cart;
    } catch (error) {
      this.logger.error(
        `Error saving a cart. Cart id: ${cart.id}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteCart(id: string): Promise<number> {
    try {
      const result = await this.delete({ id });

      this.logger.verbose(`Deleted Cart ${id}`);

      return result?.affected;
    } catch (error) {
      this.logger.error(`Error deleting a Cart. Cart id: ${id}`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
