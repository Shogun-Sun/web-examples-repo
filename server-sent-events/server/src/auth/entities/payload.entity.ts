export class PayloadEntity {
  userId: number;
  sessionVersion: number;
  constructor(partial: Partial<PayloadEntity>) {
    Object.assign(this, partial);
  }
}
