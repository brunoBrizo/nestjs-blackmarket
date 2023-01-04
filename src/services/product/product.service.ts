import { Product } from '@entities/product';
import { CreateProductDto, UpdateProductDto } from '@dtos/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from '@repository/product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository
  ) {}

  async createProduct(creadteProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.createProduct(
      creadteProductDto
    );

    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const storedProduct = await this.productRepository.findOneBy({ id });
    if (!storedProduct) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }

    const updatedProduct: Product = { ...storedProduct, ...updateProductDto };
    return await this.productRepository.updateProduct(updatedProduct);
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.deleteProduct(id);

    if (result === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
}
