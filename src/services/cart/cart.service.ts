import { Product } from '@entities/product';
import { AddProductToCartDto } from '@dtos/cart';
import { User } from '@entities/auth';
import { Cart, CartItem } from '@entities/cart';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartRepository } from '@repository/cart';
import { ProductService } from '@services/product';

export class CartService {
  constructor(
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
    private productService: ProductService
  ) {}

  private createCart(
    user: User,
    product: Product,
    quantity: number,
    subTotalPrice: number,
    price: number
  ): Cart {
    const newCart = this.cartRepository.create({
      user,
      cartItems: [{ product, quantity, subTotalPrice, price }]
    });

    return newCart;
  }

  async getCart(user: User): Promise<Cart> {
    const cart = await this.cartRepository.findByUser(user);

    if (!cart) {
      throw new NotFoundException(
        `User ${user.id} does not have an active cart`
      );
    }

    return cart;
  }

  async deleteCart(cart: Cart): Promise<void> {
    const result = await this.cartRepository.deleteCart(cart.id);

    if (result === 0) {
      throw new NotFoundException(`Cart with id ${cart.id} not found`);
    }
  }

  private recalculateCart(cart: Cart): void {
    cart.totalAmount = 0;
    cart.cartItems.forEach(item => {
      cart.totalAmount += item.quantity * item.price;
    });
  }

  async addProductToCart(
    user: User,
    addProductToCartDto: AddProductToCartDto
  ): Promise<Cart> {
    const { productId, quantity } = addProductToCartDto;

    const product = await this.productService.getProduct(productId);
    if (!product) {
      throw new NotFoundException(
        `Product with id: ${productId} was not found`
      );
    }

    const price = product.price;
    const subTotalPrice = quantity * price;

    let cart = await this.cartRepository.findByUser(user);

    if (cart) {
      const itemIndex = cart.cartItems.findIndex(
        item => item.productId === productId
      );

      if (itemIndex >= 0) {
        const item = cart.cartItems[itemIndex];
        item.quantity += quantity;
        item.subTotalPrice = item.quantity * price;

        cart.cartItems[itemIndex] = item;
      } else {
        const cartItem: CartItem = {
          cartId: cart.id,
          productId,
          price,
          subTotalPrice,
          quantity
        };

        cart.cartItems.push(cartItem);
      }
    } else {
      cart = this.createCart(user, product, quantity, subTotalPrice, price);
    }

    this.recalculateCart(cart);
    return await this.cartRepository.saveCart(cart);
  }

  async removeProductFromCart(user: User, productId: string): Promise<void> {
    const cart = await this.getCart(user);
    const itemIndex = cart.cartItems.findIndex(
      item => item.productId === productId
    );

    if (itemIndex >= 0) {
      const item = cart.cartItems[itemIndex];

      if (item.quantity > 1) {
        item.quantity -= 1;
        item.subTotalPrice = item.quantity * item.price;
        cart.cartItems[itemIndex] = item;
      } else {
        cart.cartItems.splice(itemIndex, 1);
      }

      if (cart.cartItems?.length > 0) {
        this.recalculateCart(cart);
        await this.cartRepository.saveCart(cart);
      } else {
        await this.cartRepository.deleteCart(cart.id);
      }
    }
  }
}
