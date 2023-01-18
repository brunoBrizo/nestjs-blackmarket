import { AddProductToCartDto } from '@dtos/cart';
import { User } from '@entities/auth';
import { Cart } from '@entities/cart';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartRepository } from '@repository/cart';
import { ProductRepository } from '@repository/product';

export class CartService {
  constructor(
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository
  ) {}

  private createCart(
    user: User,
    addProductToCartDto: AddProductToCartDto,
    subTotalPrice: number,
    price: number
  ): Cart {
    const newCart = this.cartRepository.create({
      user,
      items: [{ ...addProductToCartDto, subTotalPrice, price }],
      totalAmount: 0
    });

    return newCart;
  }

  async getCart(user: User): Promise<Cart> {
    return await this.cartRepository.findByUser(user);
  }

  async deleteCart(cart: Cart): Promise<void> {
    const result = await this.cartRepository.deleteCart(cart.id);

    if (result === 0) {
      throw new NotFoundException(`Cart with id ${cart.id} not found`);
    }
  }

  private recalculateCart(cart: Cart): void {
    cart.totalAmount = 0;
    cart.items.forEach(item => {
      cart.totalAmount += item.quantity * item.price;
    });
  }

  async addProductToCart(
    user: User,
    addProductToCartDto: AddProductToCartDto
  ): Promise<Cart> {
    const { productId, quantity } = addProductToCartDto;

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(
        `Product with id: ${productId} was not found`
      );
    }

    const price = product.price;
    const subTotalPrice = quantity * price;

    let cart = await this.getCart(user);

    if (cart) {
      const itemIndex = cart.items.findIndex(
        item => item.productId == productId
      );

      if (itemIndex >= 0) {
        const item = cart.items[itemIndex];
        item.quantity += quantity;
        item.subTotalPrice = item.quantity * price;

        cart.items[itemIndex] = item;
      } else {
        cart.items.push({ ...addProductToCartDto, subTotalPrice, price });
      }
    } else {
      cart = this.createCart(user, addProductToCartDto, subTotalPrice, price);
    }

    this.recalculateCart(cart);
    return await this.cartRepository.saveCart(cart);
  }

  async removeProductFromCart(user: User, productId: string): Promise<void> {
    const cart = await this.getCart(user);
    if (!cart) {
      throw new NotFoundException(
        `User ${user.id} does not have an active cart`
      );
    }

    const itemIndex = cart.items.findIndex(item => item.productId == productId);

    if (itemIndex >= 0) {
      const item = cart.items[itemIndex];

      if (item.quantity > 1) {
        item.quantity -= 1;
        item.subTotalPrice = item.quantity * item.price;
        cart.items[itemIndex] = item;
      } else {
        cart.items.splice(itemIndex, 1);
      }

      if (cart.items?.length > 0) {
        this.recalculateCart(cart);
        await this.cartRepository.saveCart(cart);
      } else {
        await this.cartRepository.deleteCart(cart.id);
      }
    }
  }
}
