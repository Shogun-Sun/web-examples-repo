import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';
import { PayloadEntity } from '../entities/payload.entity';
export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest<Request>();

    const payload = request.user as PayloadEntity;

    return payload.userId;
  },
);
