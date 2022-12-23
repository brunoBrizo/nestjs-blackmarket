import { strongPasswordOptions } from '@src/shared/utils';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  IsStrongPassword
} from 'class-validator';
import { UserType } from '@enums/auth';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32)
  @IsStrongPassword(strongPasswordOptions, {
    message:
      'Password must have upper and lower case letters, at least 1 number or special character, at least 8 characters'
  })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @IsEnum(UserType)
  type: UserType;
}
