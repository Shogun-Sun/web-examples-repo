import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'id пользователя',
    example: 1,
  })
  id: number;

  @IsString()
  @MaxLength(100)
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
  @IsString()
  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Пароль пользователя',
    example: '123456789',
  })
  password: string;
}
