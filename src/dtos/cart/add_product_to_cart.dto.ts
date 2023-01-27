import { IsNumber, IsUUID, Min } from 'class-validator';

export class AddProductToCartDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
