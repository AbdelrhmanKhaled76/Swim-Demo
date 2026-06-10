export type Status = 'PENDING' | 'COMPLETED' | 'CONFIRMED';

export interface Order {
  id: string;
  destination: string;
  location: string;
  quantity: string;
  unit: string;
  customer: string;
  customerId: string;
  status: Status;
}

export const gridClass =
  'grid grid-cols-[0.7fr_1.6fr_1fr_1.6fr_1fr_1.8fr]';
