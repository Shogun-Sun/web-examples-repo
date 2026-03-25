import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { notification_statuses } from '@prisma/client';

export class NotificationDto {
  @ApiProperty({
    enum: notification_statuses,
    default: notification_statuses.info,
    description: 'Статус уведомления',
    example: notification_statuses.info,
  })
  @IsEnum(notification_statuses)
  @IsOptional()
  status: notification_statuses = notification_statuses.info;

  @ApiProperty({
    description: 'Заголовок уведомления',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Тело уведомления',
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}
