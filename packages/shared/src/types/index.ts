import type { TransactionType } from '../constants';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryId: string;
  category: Category;
  userId: string;
  isRecurring: boolean;
  recurringId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  type: TransactionType;
  userId: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  category: Category;
  userId: string;
  spent?: number;
  percentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  categoryId: string;
  userId: string;
  dayOfMonth: number;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  month: number;
  year: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  categoryIcon: string | null;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

export interface YearlyOverview {
  year: number;
  months: MonthlySummary[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
