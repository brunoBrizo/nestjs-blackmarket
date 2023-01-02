import { Product } from '@entities/product';
import { CreateProductDto, UpdateProductDto } from '@dtos/product';
import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
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

    const product = await this.productRepository.createProduct(
      createProductDto,
      category
    );

    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const storedProduct = await this.productRepository.findById(id);
    if (!storedProduct) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }

    const { name, categoryId } = updateProductDto;

    if (name !== storedProduct.name) {
      const productExists = await this.productRepository.findByName(name);
      if (productExists) {
        throw new ConflictException('Product name already in use');
      }
    }

    if (categoryId !== storedProduct.category.id) {
      const updatedCategory = await this.categoryRepository.findById(
        categoryId
      );

      if (updatedCategory) {
        storedProduct.category = updatedCategory;
      } else {
        throw new NotFoundException(`Category ${categoryId} was not found`);
      }
    }

    const updatedProduct = { ...storedProduct, ...updateProductDto };
    return this.productRepository.updateProduct(updatedProduct);
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.deleteProduct(id);

    if (result === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
}
