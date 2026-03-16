import type { TransactionType } from '@controle-financeiro/shared';
import type { StoredCategory } from '@/domains/categories/types';

export interface StoredTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionWithCategory extends StoredTransaction {
  category: StoredCategory | null;
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  type?: TransactionType;
  categoryId?: string;
  search?: string;
}
