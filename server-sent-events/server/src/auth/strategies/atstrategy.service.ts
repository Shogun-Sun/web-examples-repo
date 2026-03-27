import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadEntity } from '../entities/payload.entity';
import type { Request } from 'express';

@Injectable()
export class AtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const accessHash = configService.get<string>('ACCESS_SECRET');

    if (!accessHash) {
      throw new Error('Нету хэша для access токена');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessHash,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: PayloadEntity) {
    const authHeader = req.get('authorization');
    if (!authHeader) {
      throw new BadRequestException('Refresh токе не указан');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
