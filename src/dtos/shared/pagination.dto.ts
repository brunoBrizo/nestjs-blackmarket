import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  take?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number;
}
