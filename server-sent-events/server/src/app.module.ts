import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NotificationsModule,
    PrismaModule,
    UsersModule,
  ],
})
export class AppModule {}
