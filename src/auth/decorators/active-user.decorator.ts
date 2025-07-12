import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return field ? request.user?.[field] : request.user;
  },
);
