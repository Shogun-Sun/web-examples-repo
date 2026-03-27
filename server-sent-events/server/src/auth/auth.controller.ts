import {
  Controller,
  Body,
  Post,
  Headers,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { TokensEntity } from './entities/tokens.entity';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from './guards/at.guard';
import { RtGuard } from './guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOkResponse({
    type: TokensEntity,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
  ) {
    return await this.authService.login(loginDto, userAgent);
  }

  @UseGuards(RtGuard)
  @Get('refresh')
  refresh() {}
}
