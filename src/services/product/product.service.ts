import { Product } from '@entities/product';
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto
} from '@dtos/product';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from '@repository/product';
import { SortProductsCriteria } from '@enums/products';
import { OrderCriteria } from '@enums/order_criteria.enum';
import { SubCategoryService } from '@services/subcategory';
import { CategoryService } from '@services/category';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, subCategoryId } = createProductDto;

    const subCategory = await this.subCategoryService.getSubCategory(
      subCategoryId
    );
    if (!subCategory) {
      throw new NotFoundException(`SubCategory ${subCategoryId} was not found`);
    }

    const category = await this.categoryService.getCategory(categoryId);
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

  async getAllProducts(getProductsDto: GetProductsDto): Promise<Product[]> {
    const {
      take = 10,
      skip = 0,
      sort = SortProductsCriteria.CREATED_AT,
      order = OrderCriteria.ASC,
      search,
      categories = []
    } = getProductsDto;

    return this.productRepository.getAll(
      take,
      skip,
      sort,
      order,
      search,
      categories
    );
  }

  async getProduct(id: string): Promise<Product> {
    return this.productRepository.findById(id);
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

  async validateStock(id: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    return product.stock >= quantity;
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    if (product.stock >= quantity) {
      product.stock -= quantity;
    } else {
      throw new ConflictException(
        `Insufficient stock for product ${product.id}`
      );
    }

    await this.productRepository.updateProduct(product);
  }
}
