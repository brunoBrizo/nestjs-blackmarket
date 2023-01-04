import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;
}
