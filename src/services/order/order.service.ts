import { CreateOrderDto } from '@dtos/order';
import { User, UserAddress } from '@entities/auth';
import { Cart } from '@entities/cart';
import { Order, OrderItem } from '@entities/order';
import { PaymentStatus } from '@enums/order';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@repository/auth';
import { CartRepository } from '@repository/cart';
import { OrderRepository } from '@repository/order';
import { ProductService } from '@services/product';

export class OrderService {
  private logger: Logger = new Logger('OrderService', {
    timestamp: true
  });

  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private productService: ProductService
  ) {}

  async createOrder(
    user: User,
    createOrderDto: CreateOrderDto
  ): Promise<Order> {
    const cart = await this.cartRepository.findByUser(user);
    if (!cart) {
      throw new NotFoundException(`User does not have an active cart`);
    }

    const { userAddressId } = createOrderDto;
    const userAddress = await this.validateUserAddress(user, userAddressId);
    const [orderItems, totalAmount] = this.getOrderItemsAndTotalAmount(cart);

    await this.validateProductsStock(orderItems);

    const order = this.orderRepository.create({
      user,
      totalAmount,
      paymentStatus: PaymentStatus.Created,
      orderItems: [...orderItems],
      userAddress
    });

    await this.orderRepository.saveOrder(order);
    this.logger.log(`Created order ${order.id} for user ${user.id}`);

    await this.updateProductStock(order.orderItems);
    await this.cartRepository.deleteCart(cart.id);

    return order;
  }

  private async validateUserAddress(
    user: User,
    userAddressId: string
  ): Promise<UserAddress> {
    user.addressList = await this.userRepository.loadUserAddresses(user);
    const validAddress = user.addressList.find(
      address => address.id === userAddressId
    );

    if (!validAddress) {
      throw new NotFoundException(
        `User address not found. User id: ${user.id}`
      );
    }

    return validAddress;
  }

  private getOrderItemsAndTotalAmount(cart: Cart): [OrderItem[], number] {
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    cart.cartItems.forEach(item => {
      orderItems.push({
        price: item.price,
        quantity: item.quantity,
        productId: item.productId,
        subTotalPrice: item.subTotalPrice
      });

      totalAmount += item.subTotalPrice;
    });

    return [orderItems, totalAmount];
  }

  private async validateProductsStock(orderItems: OrderItem[]) {
    for (const item of orderItems) {
      const validStock = await this.productService.validateStock(
        item.productId,
        item.quantity
      );

      if (!validStock) {
        throw new ConflictException(
          `Insufficient stock for product ${item.productId}`
        );
      }
    }
  }

  private async updateProductStock(orderItems: OrderItem[]) {
    for (const item of orderItems) {
      await this.productService.updateStock(item.productId, item.quantity);
    }
  }
}
