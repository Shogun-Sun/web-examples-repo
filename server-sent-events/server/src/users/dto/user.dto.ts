import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { IsEmail, IsNumber, IsString, MaxLength } from 'class-validator';

export class UserDto extends OmitType(UserEntity, ['password'] as const) {
  @IsNumber()
  @ApiProperty({
    description: 'id пользователя',
  })
  id: number;

  @ApiProperty({
    description: 'Имя пользователя',
  })
  @MaxLength(30)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'email пользователя',
  })
  @IsEmail({}, { message: 'Неверный формат эл. почты' })
  email: string;
}
