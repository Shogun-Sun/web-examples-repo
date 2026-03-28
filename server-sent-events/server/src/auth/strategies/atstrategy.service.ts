import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadEntity } from '../entities/payload.entity';
import type { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
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

  async validate(req: Request, payload: PayloadEntity) {
    const authHeader = req.get('authorization');
    if (!authHeader) {
      throw new BadRequestException('Refresh токе не указан');
    }

    const sessionVersionInDb = await this.prismaService.users.findUnique({
      where: { id: payload.userId },
      select: { sessionVersion: true },
    });

    if (
      !sessionVersionInDb ||
      sessionVersionInDb.sessionVersion !== payload.sessionVersion
    ) {
      throw new UnauthorizedException('Сессия устарела, войдите снова');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
