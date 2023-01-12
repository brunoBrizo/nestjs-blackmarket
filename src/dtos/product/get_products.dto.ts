import { PaginationDto } from '@dtos/shared';
import { OrderCriteria } from '@enums/order_criteria.enum';
import { SortProductsCriteria } from '@enums/products';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetProductsDto extends PaginationDto {
  @IsEnum(SortProductsCriteria)
  @IsOptional()
  sort?: SortProductsCriteria;

  @IsEnum(OrderCriteria)
  @IsOptional()
  order?: OrderCriteria;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categories: string[];
}
