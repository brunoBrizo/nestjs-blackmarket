import { Category } from '@entities/category';
import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { ErrorCodes } from '@enums/error_codes.enum';
import { SubCategory } from '@entities/subcategory';
import { CreateSubCategoryDto } from '@dtos/subcategory';

@Injectable()
export class SubCategoryRepository extends Repository<SubCategory> {
  private logger: Logger = new Logger('SubCategoryRepository', {
    timestamp: true
  });
  constructor(private dataSource: DataSource) {
    super(SubCategory, dataSource.createEntityManager());
  }

  async createSubCategory(
    createSubCategoryDto: CreateSubCategoryDto,
    category: Category
  ): Promise<SubCategory> {
    const { name, description } = createSubCategoryDto;

    const subCategory = this.create({
      name,
      description,
      category
    });

    try {
      await this.save(subCategory);

      this.logger.verbose(
        `Created SubCategory ${name} for Category ${category.name}`
      );

      return subCategory;
    } catch (error) {
      this.logger.error(
        `Error creating SubCategory. SubCategory name: ${name}`,
        error.stack
      );
      if (error.code === ErrorCodes.DB_DUPLICATE_VALUE) {
        throw new ConflictException(
          `SubCategory name already in use for Category ${category.name}`
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findById(id: string): Promise<SubCategory> {
    try {
      return await this.findOneBy({ id });
    } catch (error) {
      this.logger.error(`Error getting a subCategory by id`, error);
      throw new InternalServerErrorException();
    }
  }

  async updateSubCategory(subCategory: SubCategory): Promise<SubCategory> {
    try {
      await this.save(subCategory);

      this.logger.verbose(
        `Updated SubCategory ${subCategory.name} for Category ${subCategory.category.name}`
      );

      return subCategory;
    } catch (error) {
      this.logger.error(
        `Error updating a SubCategory. SubCategory name: ${subCategory.name}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteSubCategory(id: string): Promise<number> {
    try {
      const result = await this.delete({ id });

      const affected = result?.affected;
      if (affected > 0) {
        this.logger.verbose(`Deleted SubCategory ${id}`);
      }

      return affected;
    } catch (error) {
      this.logger.error(
        `Error deleting a SubCategory. SubCategory id: ${id}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
