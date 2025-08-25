export type TxType = 'SUBSCRIPTION' | 'CANCELLATION';
export type NotificationMethod = 'email' | 'sms';

export interface Transaction {
  id: number;
  date: string;         // ISO
  type: TxType;
  fundId: number;
  amount: number;
  notification?: NotificationMethod; // solo en suscripción
}
