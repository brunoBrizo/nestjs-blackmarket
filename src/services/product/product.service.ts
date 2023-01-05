import { Product } from '@entities/product';
import { CreateProductDto, UpdateProductDto } from '@dtos/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from '@repository/product';
import { CategoryRepository } from '@repository/category';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId } = createProductDto;

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} was not found`);
    }

    return await this.productRepository.createProduct(
      createProductDto,
      category
    );
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const storedProduct = await this.productRepository.findById(id);
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
