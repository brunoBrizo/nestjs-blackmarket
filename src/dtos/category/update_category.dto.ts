import { DESCRIPTION_MAX_LENGTH } from '@src/shared/utils';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(DESCRIPTION_MAX_LENGTH)
  description: string;
}
