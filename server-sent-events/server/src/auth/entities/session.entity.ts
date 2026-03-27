export class SessionEntity {
  id: number;
  refreshToken: string;
  userId: number;
  deviceInfo: string;
  createdAt: Date;

  constructor(partial: Partial<SessionEntity>) {
    Object.assign(this, partial);
  }
}
