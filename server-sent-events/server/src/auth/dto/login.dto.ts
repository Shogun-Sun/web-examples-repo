import { OmitType } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class LoginDto extends OmitType(UserEntity, ['name', 'id']) {}
