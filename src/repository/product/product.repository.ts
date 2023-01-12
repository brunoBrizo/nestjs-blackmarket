import { SubCategory } from '@entities/subcategory';
import { Brackets, DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { ErrorCodes } from '@enums/error_codes.enum';
import { Product } from '@entities/product';
import { CreateProductDto } from '@dtos/product';
import { Category } from '@entities/category';
import { SortProductsCriteria } from '@enums/products';
import { OrderCriteria } from '@enums/order_criteria.enum';

@Injectable()
export class ProductRepository extends Repository<Product> {
  private logger: Logger = new Logger('ProductRepository', { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createProduct(
    createProductDto: CreateProductDto,
    category: Category,
    subCategory: SubCategory
  ): Promise<Product> {
    const { name, description, price, stock } = createProductDto;

    const product = this.create({
      name,
      description,
      price,
      stock,
      category,
      subCategory
    });

    try {
      await this.save(product);

      this.logger.verbose(`Created Product ${product.name}`);

      return product;
    } catch (error) {
      this.logger.error(
        `Error creating Product. Product name: ${name}`,
        error.stack
      );
      if (error.code === ErrorCodes.DB_DUPLICATE_VALUE) {
        throw new ConflictException('Product name already in use');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAll(
    take: number,
    skip: number,
    sort: SortProductsCriteria,
    order: OrderCriteria,
    search: string,
    categories: string[]
  ): Promise<Product[]> {
    try {
      const query = this.createQueryBuilder('product');
      const sortStr = `product.${sort}`;

      if (search) {
        query.where(
          new Brackets(q =>
            q.where(
              'LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search)',
              { search: `%${search}%` }
            )
          )
        );
      }

      if (categories.length > 0) {
        query
          .leftJoinAndSelect('product.category', 'category')
          .where('category.id IN (:...categories)', { categories });
      }

      const result = await query
        .take(take)
        .skip(skip)
        .orderBy(sortStr, order)
        .getMany();

      return result;
    } catch (error) {
      this.logger.error(`Error getting all products`, error);
      throw new InternalServerErrorException();
    }
  }

  async findByName(name: string): Promise<Product> {
    try {
      return await this.findOneBy({ name });
    } catch (error) {
      this.logger.error(`Error getting a product by name`, error);
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string): Promise<Product> {
    try {
      return await this.findOneBy({ id });
    } catch (error) {
      this.logger.error(`Error getting a product by id`, error);
      throw new InternalServerErrorException();
    }
  }

  async updateProduct(product: Product): Promise<Product> {
    try {
      await this.save(product);

      this.logger.verbose(`Updated Product ${product.name}`);

      return product;
    } catch (error) {
      this.logger.error(
        `Error updating a Product. Product name: ${product.name}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteProduct(id: string): Promise<number> {
    try {
      const result = await this.delete({ id });

      this.logger.verbose(`Deleted Product ${id}`);

      return result?.affected;
    } catch (error) {
      this.logger.error(
        `Error deleting a Product. Product id: ${id}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
