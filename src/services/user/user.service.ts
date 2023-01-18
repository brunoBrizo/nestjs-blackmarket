import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@repository/auth';
import { ProductRepository } from '@repository/product';
import { AddFavoriteProductDto } from '@dtos/user';
import { User } from '@entities/auth';
import { Product } from '@entities/product';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository
  ) {}

  async addFavoriteProduct(
    addFavoriteProductDto: AddFavoriteProductDto,
    user: User
  ): Promise<User> {
    user.favoriteProducts = await this.userRepository.loadUserProducts(user);
    const { productId } = addFavoriteProductDto;

    if (this.isFavoriteProduct(user, productId)) {
      throw new ConflictException('Product already added as favorite');
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product ${productId} was not found`);
    }

    user.favoriteProducts.push(product);

    return this.userRepository.saveUser(user);
  }

  async removeFavoriteProduct(productId: string, user: User): Promise<User> {
    user.favoriteProducts = await this.userRepository.loadUserProducts(user);

    if (!this.isFavoriteProduct(user, productId)) {
      throw new NotFoundException(
        `Product ${productId} was not found as favorite`
      );
    }

    user.favoriteProducts = user.favoriteProducts.filter(
      product => product.id !== productId
    );

    return this.userRepository.saveUser(user);
  }

  private isFavoriteProduct(
    user: User,
    productId: string
  ): Product | undefined {
    const favoriteProduct = user.favoriteProducts.find(
      product => product.id === productId
    );

    return favoriteProduct;
  }
}
