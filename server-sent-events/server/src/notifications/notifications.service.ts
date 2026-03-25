import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationEntity } from './entities/notification.entity';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly notificationStream$ = new Subject<NotificationEntity>();

  async create(createNotificationDto: CreateNotificationDto) {
    const newNotification = await this.prismaService.notifications.create({
      data: createNotificationDto,
    });

    this.notificationStream$.next(newNotification);

    return newNotification;
  }

  async findAll() {
    return await this.prismaService.notifications.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  getEventStream(): Observable<NotificationEntity> {
    return this.notificationStream$.asObservable();
  }
}
