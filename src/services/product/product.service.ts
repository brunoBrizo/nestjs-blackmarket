import { Product } from '@entities/product';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto
} from '@dtos/product';
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from '@repository/product';
import { CategoryRepository } from '@repository/category';
import { SubCategoryRepository } from '@repository/subcategory';
import { SortProductsCriteria } from '@enums/products';
import { OrderCriteria } from '@enums/order_criteria.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    @InjectRepository(SubCategoryRepository)
    private subCategoryRepository: SubCategoryRepository
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, subCategoryId } = createProductDto;

    const subCategory = await this.subCategoryRepository.findById(
      subCategoryId
    );
    if (!subCategory) {
      throw new NotFoundException(`SubCategory ${subCategoryId} was not found`);
    }

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} was not found`);
    }

    if (subCategory.category.id !== categoryId) {
      throw new BadRequestException(
        `Sent Category does not match with SubCategory`
      );
    }

    return await this.productRepository.createProduct(
      createProductDto,
      category,
      subCategory
    );
  }

  async getAllProducts(getProductsDto: GetProductsDto) {
    const {
      take = 10,
      skip = 0,
      sort = SortProductsCriteria.CREATED_AT,
      order = OrderCriteria.ASC
    } = getProductsDto;

    return await this.productRepository.getAll(take, skip, sort, order);
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
