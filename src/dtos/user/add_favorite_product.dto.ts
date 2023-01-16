import { IsUUID } from 'class-validator';

export class AddFavoriteProductDto {
  @IsUUID()
  productId?: string;
}
