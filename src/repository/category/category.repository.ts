import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { ErrorCodes } from '@enums/error_codes.enum';
import { Category } from '@entities/category';
import { CreateCategoryDto } from '@dtos/category';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  private logger: Logger = new Logger('CategoryRepository', {
    timestamp: true
  });
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const { name, description } = createCategoryDto;

    const category = this.create({
      name,
      description
    });

    try {
      await this.save(category);

      this.logger.verbose(`Created Category ${name}`);

      return category;
    } catch (error) {
      this.logger.error(
        `Error creating Category. Category name: ${name}`,
        error.stack
      );
      if (error.code === ErrorCodes.DB_DUPLICATE_VALUE) {
        throw new ConflictException('Category name already in use');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findByName(name: string): Promise<Category> {
    try {
      return await this.findOneBy({ name });
    } catch (error) {
      this.logger.error(`Error getting a category by name`, error);
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string): Promise<Category> {
    try {
      return await this.findOneBy({ id });
    } catch (error) {
      this.logger.error(`Error getting a category by id`, error);
      throw new InternalServerErrorException();
    }
  }

  async updateCategory(category: Category): Promise<Category> {
    try {
      await this.save(category);

      this.logger.verbose(`Updated Category ${category.name}`);

      return category;
    } catch (error) {
      this.logger.error(
        `Error updating a Category. Category name: ${category.name}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteCategory(id: string): Promise<number> {
    try {
      const result = await this.delete({ id });

      const affected = result?.affected;
      if (affected > 0) {
        this.logger.verbose(`Deleted Category ${id}`);
      }

      return affected;
    } catch (error) {
      this.logger.error(
        `Error deleting a Category. Category id: ${id}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
