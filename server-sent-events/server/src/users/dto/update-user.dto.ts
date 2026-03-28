import { UserEntity } from '../entities/user.entity';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(PartialType(UserEntity), [
  'id',
  'password',
]) {}
