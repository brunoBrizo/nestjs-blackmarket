import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '@src/shared/utils';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(NAME_MAX_LENGTH)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  description: string;
}
