import type { StoredCategory } from '@/domains/categories/types';

export interface StoredBudget {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithDetails extends StoredBudget {
  category: StoredCategory | null;
  spent: number;
  percentage: number;
}
