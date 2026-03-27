import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AtStrategyService } from './strategies/atstrategy.service';
import { RtStrategyService } from './strategies/rtstrategy.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PassportModule, JwtModule, ConfigModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AtStrategyService, RtStrategyService],
})
export class AuthModule {}
