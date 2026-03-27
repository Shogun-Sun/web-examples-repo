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
    };

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
}
