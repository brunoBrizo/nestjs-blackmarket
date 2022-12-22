import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import { UserType } from '../user_type.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must have upper and lower case letters, at least 1 number or special character'
  })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @IsEnum(UserType)
  type: UserType;
}
