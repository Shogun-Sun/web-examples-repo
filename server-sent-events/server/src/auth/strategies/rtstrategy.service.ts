import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadEntity } from '../entities/payload.entity';

@Injectable()
export class RtStrategyService extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    const refreshToken = configService.get<string>('REFRESH_SECRET');

    if (!refreshToken) {
      throw new Error('Нету хэша для refresh токена');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshToken,
    });
  }

  validate(payload: PayloadEntity) {
    return payload;
  }
}
