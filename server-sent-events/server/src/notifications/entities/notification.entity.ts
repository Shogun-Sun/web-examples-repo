import { notification_statuses } from '@prisma/client';
export class NotificationEntity {
  id: number;
  status: notification_statuses;
  title: string;
  body: any;
  createdAt: Date;
}
