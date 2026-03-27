export class PayloadEntity {
  userId: number;
  constructor(partial: Partial<PayloadEntity>) {
    Object.assign(this, partial);
  }
}
