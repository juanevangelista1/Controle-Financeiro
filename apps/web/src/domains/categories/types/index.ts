import type { TransactionType } from '@controle-financeiro/shared';

export interface StoredCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  type: TransactionType;
  isDefault: boolean;
  createdAt: string;
}
