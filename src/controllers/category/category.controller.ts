import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidateUserType } from '@decorators/auth';
import { UserType } from '@enums/auth';
import { UserTypeGuard } from '@shared/guards';
import { CategoryService } from '@services/category';
import { CreateCategoryDto, UpdateCategoryDto } from '@dtos/category';
import { Category } from '@entities/category';
import { ResponseMapperInterceptor } from '@shared/interceptors';

@Controller('category')
@UseGuards(AuthGuard(), UserTypeGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/')
  @UseInterceptors(new ResponseMapperInterceptor())
  @ValidateUserType(UserType.ADMIN)
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Put('/:id')
  @UseInterceptors(new ResponseMapperInterceptor())
  @ValidateUserType(UserType.ADMIN)
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @UseInterceptors(new ResponseMapperInterceptor())
  @ValidateUserType(UserType.ADMIN)
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
