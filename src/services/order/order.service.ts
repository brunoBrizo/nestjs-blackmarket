import { CreateOrderDto } from '@dtos/order';
import { User, UserAddress } from '@entities/auth';
import { Cart } from '@entities/cart';
import { Order, OrderItem } from '@entities/order';
import { PaymentStatus } from '@enums/order';
import { PaymentIntentEvent } from '@enums/stripe';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '@repository/order';
import { CartService } from '@services/cart';
import { ProductService } from '@services/product';
import { StripeService } from '@services/stripe';
import { UserService } from '@services/user';
import { Stripe } from 'stripe';

export class OrderService {
  private logger: Logger = new Logger('OrderService', {
    timestamp: true
  });

  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private stripeService: StripeService
  ) {}

  async createOrder(
    user: User,
    createOrderDto: CreateOrderDto
  ): Promise<Order> {
    const { userAddressId } = createOrderDto;

    const [cart, userAddress] = await Promise.all([
      this.cartService.getCart(user),
      this.validateUserAddress(user, userAddressId)
    ]);

    if (!cart) {
      throw new NotFoundException(`User does not have an active cart`);
    }

    const [orderItems, totalAmount] = this.getOrderItemsAndTotalAmount(cart);
    await this.validateProductsStock(orderItems);

    const order = this.orderRepository.create({
      user,
      totalAmount,
      paymentStatus: PaymentStatus.Created,
      orderItems: [...orderItems],
      userAddress
    });

    await Promise.all([
      this.orderRepository.saveOrder(order),
      this.updateProductStock(order.orderItems),
      this.cartService.deleteCart(cart)
    ]);

    this.logger.log(`Created order ${order.id} for user ${user.id}`);

    await this.stripeService.createPaymentIntent(order.id, order.totalAmount);
    return order;
  }

  private async validateUserAddress(
    user: User,
    userAddressId: string
  ): Promise<UserAddress> {
    user = await this.userService.loadUser(user, true);
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

  async updatePaymentStatus(event: Stripe.Event): Promise<void> {
    const orderId = event.data.object['metadata'].orderId;
    const order = await this.orderRepository.findById(orderId);

    switch (event.type) {
      case PaymentIntentEvent.Succeeded:
        order.paymentStatus = PaymentStatus.Succeeded;
        break;

      case PaymentIntentEvent.Processing:
        order.paymentStatus = PaymentStatus.Processing;
        break;

      case PaymentIntentEvent.Failed:
        order.paymentStatus = PaymentStatus.Failed;
        break;

      default:
        order.paymentStatus = PaymentStatus.Created;
        break;
    }

    await this.orderRepository.saveOrder(order);
  }
}
