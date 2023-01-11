import { PaginationDto } from '@dtos/shared';
import { OrderCriteria } from '@enums/order_criteria.enum';
import { SortProductsCriteria } from '@enums/products';
import { IsEnum, IsOptional } from 'class-validator';

export class GetProductsDto extends PaginationDto {
  @IsEnum(SortProductsCriteria)
  @IsOptional()
  sort?: SortProductsCriteria;

  @IsEnum(OrderCriteria)
  @IsOptional()
  order?: OrderCriteria;
}
