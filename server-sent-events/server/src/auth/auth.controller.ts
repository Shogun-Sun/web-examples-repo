import {
  Controller,
  Body,
  Post,
  Headers,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TokensEntity } from './entities/tokens.entity';
import { RtGuard } from './guards/rt.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorator';

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
  @ApiBearerAuth('refresh-token')
  @Get('refresh')
  async refresh(
    @GetCurrentUser('userId') userId: number,
    @GetCurrentUser('refreshToken') oldToken: string,
  ) {
    return await this.authService.updateRefreshToken(userId, oldToken);
  }

  @ApiBearerAuth('access-token')
  @Delete('reset/:userId')
  async resetSessions(@Param('userId') userId: string) {
    return await this.authService.resetAllSessions(Number(userId));
  }
}
