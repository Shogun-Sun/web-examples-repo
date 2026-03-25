import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), NotificationsModule, PrismaModule],
})
export class AppModule {}
