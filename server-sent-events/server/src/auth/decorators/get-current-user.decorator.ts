import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';
import { PayloadEntity } from '../entities/payload.entity';

type UserWithToken = PayloadEntity & { refreshToken?: string };

export const GetCurrentUser = createParamDecorator(
  (data: keyof UserWithToken | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as UserWithToken;

    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return data ? user[data] : user;
  },
);
