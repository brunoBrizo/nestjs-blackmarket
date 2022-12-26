import { CreateProductDto, UpdateProductDto } from '@dtos/product';
import { Product } from '@entities/product';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from '@services/product';

@Controller('product')
@UseGuards(AuthGuard())
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Put('/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @HttpCode(200)
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deleteProduct(id);
  }
}
