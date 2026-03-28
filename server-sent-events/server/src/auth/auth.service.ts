import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { TokensEntity } from './entities/tokens.entity';
import { PayloadEntity } from './entities/payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, userAgent: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Неверный email или пароль');
    }

    await this.prismaService.users.update({
      where: { email: user.email },
      data: { sessionVersion: 0 },
    });
    const tokens = new TokensEntity(await this.genTokens(user.id));
    const hashedRefresh = await bcrypt.hash(
      tokens.refreshToken,
      Number(this.configService.get<string>('SALT_ROUNDS')),
    );
    await this.prismaService.sessions.create({
      data: {
        refreshToken: hashedRefresh,
        userId: user.id,
        deviceInfo: userAgent,
      },
    });

    return new TokensEntity(tokens);
  }

  async updateRefreshToken(userId: number, oldRefreshtoken: string) {
    const oldHash = await this.getHashedRefreshToken(oldRefreshtoken);
    const session = await this.prismaService.sessions.findUnique({
      where: {
        userId,
        refreshToken: oldHash,
      },
    });

    if (!session) throw new UnauthorizedException();

    const newTokens = await this.genTokens(userId);

    await this.prismaService.sessions.update({
      where: {
        userId,
        refreshToken: oldHash,
      },
      data: {
        refreshToken: await this.getHashedRefreshToken(newTokens.refreshToken),
      },
    });

    return new TokensEntity(newTokens);
  }

  async genTokens(userId: number) {
    const jwtPayload = {
      userId: userId,
      sessionVersion: 0,
    } as PayloadEntity;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('ACCESS_SECRET'),
        expiresIn: '15m',
      }),

      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async getHashedRefreshToken(token: string) {
    const saltRounds = this.configService.get<string>('SALT_ROUNDS');
    if (!saltRounds)
      throw new Error('Не указано количество операций при хешировании');

    return await bcrypt.hash(token, saltRounds);
  }

  async resetAllSessions(userId: number) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('Пользователь не авторизован');

    await this.prismaService.users.update({
      where: { id: userId },
      data: { sessionVersion: Number(user.sessionVersion) + 1 },
    });
  }
}
