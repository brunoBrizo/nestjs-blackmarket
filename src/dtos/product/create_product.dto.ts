import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '@src/shared/utils';
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
  @MaxLength(NAME_MAX_LENGTH)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  stock: number;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  subCategoryId: string;
}
