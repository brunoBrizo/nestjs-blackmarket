import { UserType } from '@enums/auth';
import { SetMetadata } from '@nestjs/common';

export const USER_TYPE_KEY = 'userType';
export const ValidateUserType = (...userTypes: UserType[]) =>
  SetMetadata(USER_TYPE_KEY, userTypes);
