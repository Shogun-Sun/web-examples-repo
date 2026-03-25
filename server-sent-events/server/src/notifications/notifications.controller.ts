import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';
import { map, Observable } from 'rxjs';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.notificationsService.getEventStream().pipe(
      map(
        (notification): MessageEvent => ({
          id: notification.id.toString(),
          type: notification.status,
          data: notification,
          retry: 5000,
        }),
      ),
    );
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll() {
    return await this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить уведомление по id',
  })
  @ApiOkResponse({
    description: 'Объект уведомления',
    type: NotificationDto,
  })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
