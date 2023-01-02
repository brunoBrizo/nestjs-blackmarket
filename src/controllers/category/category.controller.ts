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

import { ValidateUserType } from '@decorators/auth';
import { UserType } from '@enums/auth';
import { UserTypeGuard } from '@shared/guards';
import { CategoryService } from '@services/category';
import { CreateCategoryDto, UpdateCategoryDto } from '@dtos/category';
import { Category } from '@entities/category';

@Controller('category')
@UseGuards(AuthGuard(), UserTypeGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/')
  @ValidateUserType(UserType.ADMIN)
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Put('/:id')
  @ValidateUserType(UserType.ADMIN)
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @HttpCode(200)
  @Delete('/:id')
  @ValidateUserType(UserType.ADMIN)
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
