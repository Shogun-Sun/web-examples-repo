import { ApiProperty } from '@nestjs/swagger';
export class TokensEntity {
  @ApiProperty({
    description: 'Токен доступа',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Токен обновления',
  })
  refreshToken: string;

  constructor(partial: Partial<TokensEntity>) {
    Object.assign(this, partial);
  }
}
