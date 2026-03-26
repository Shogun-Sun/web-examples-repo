import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'id пользователя',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Имя пользователя',
    example: ' Иван',
    minLength: 5,
    maxLength: 50,
  })
  name: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'ivan@example.com',
  })
  email: string;

  @Exclude()
  @ApiProperty({
    description: 'Пароль пользователя',
    example: '123456789',
  })
  password: string;
}
