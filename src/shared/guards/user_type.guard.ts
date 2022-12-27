import { UserType } from '@enums/auth';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_TYPE_KEY } from '@decorators/auth';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(
      USER_TYPE_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredTypes) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredTypes.some(type => user.type?.includes(type));
  }
}
