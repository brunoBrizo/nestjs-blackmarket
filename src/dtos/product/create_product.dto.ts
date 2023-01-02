import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  stock: number;

  @IsUUID()
  categoryId: string;
}
