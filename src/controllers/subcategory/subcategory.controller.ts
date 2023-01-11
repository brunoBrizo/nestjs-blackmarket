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
import { SubCategoryService } from '@services/subcategory';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '@dtos/subcategory';
import { SubCategory } from '@entities/subcategory';

@Controller('subcategory')
@UseGuards(AuthGuard(), UserTypeGuard)
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Post('/')
  @ValidateUserType(UserType.ADMIN)
  createSubCategory(
    @Body() createSubCategoryDto: CreateSubCategoryDto
  ): Promise<SubCategory> {
    return this.subCategoryService.createSubCategory(createSubCategoryDto);
  }

  @Put('/:id')
  @ValidateUserType(UserType.ADMIN)
  updateSubCategory(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto
  ): Promise<SubCategory> {
    return this.subCategoryService.updateSubCategory(id, updateSubCategoryDto);
  }

  @HttpCode(200)
  @Delete('/:id')
  @ValidateUserType(UserType.ADMIN)
  deleteSubCategory(@Param('id') id: string): Promise<void> {
    return this.subCategoryService.deleteSubCategory(id);
  }
}
