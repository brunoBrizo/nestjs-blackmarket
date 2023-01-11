import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '@src/shared/utils';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(NAME_MAX_LENGTH)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  description: string;

  @IsUUID()
  categoryId?: string;
}
