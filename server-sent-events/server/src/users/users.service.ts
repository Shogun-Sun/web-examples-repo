import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = await this.prismaService.users.create({
      data: createUserDto,
    });

    return data;
  }

  async findAll() {
    return await this.prismaService.users.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
      return null;
    }

    return new UserEntity(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prismaService.users.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.users.delete({
      where: { id },
    });
  }
}
