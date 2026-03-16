import { TRANSACTION_TYPES } from '@controle-financeiro/shared';
import { filterTransactions, calculateMonthlySummary } from '@/domains/transactions/services/transactionService';
import type { StoredTransaction } from '@/domains/transactions/types';
import type { StoredCategory } from '@/domains/categories/types';

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
  months: ReturnType<typeof calculateMonthlySummary>[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function buildCategoryBreakdown(
  transactions: StoredTransaction[],
  categories: StoredCategory[],
  month: number,
  year: number,
): CategorySummary[] {
  const expenseTransactions = filterTransactions(transactions, {
    month,
    year,
    type: TRANSACTION_TYPES.EXPENSE,
  });

  const totalExpense = expenseTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const categoryTotals = expenseTransactions.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.categoryId] = (acc[transaction.categoryId] ?? 0) + transaction.amount;
    return acc;
  }, {});

  const summaries: CategorySummary[] = Object.entries(categoryTotals).map(
    ([categoryId, totalAmount]) => {
      const category = categories.find((cat) => cat.id === categoryId);
      const percentage = totalExpense > 0 ? Math.round((totalAmount / totalExpense) * 100) : 0;
      const transactionCount = expenseTransactions.filter(
        (transaction) => transaction.categoryId === categoryId,
      ).length;

      return {
        categoryId,
        categoryName: category?.name ?? 'Desconhecida',
        categoryColor: category?.color ?? null,
        categoryIcon: category?.icon ?? null,
        totalAmount,
        percentage,
        transactionCount,
      };
    },
  );

  return summaries.sort((a, b) => b.totalAmount - a.totalAmount);
}

export function buildYearlyOverview(
  transactions: StoredTransaction[],
  year: number,
): YearlyOverview {
  const months = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return calculateMonthlySummary(transactions, month, year);
  });

  const totalIncome = months.reduce((sum, month) => sum + month.totalIncome, 0);
  const totalExpense = months.reduce((sum, month) => sum + month.totalExpense, 0);

  return {
    year,
    months,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}
