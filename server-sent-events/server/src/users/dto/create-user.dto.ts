import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto extends OmitType(UserEntity, ['id']) {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;

  @IsString()
  password: string;
}
