import { TRANSACTION_TYPES } from '@controle-financeiro/shared';
import type { StoredCategory } from '@/domains/categories/types';
import type { StoredTransaction, TransactionFilters, TransactionWithCategory } from '../types';

export function enrichTransactionsWithCategories(
  transactions: StoredTransaction[],
  categories: StoredCategory[],
): TransactionWithCategory[] {
  return transactions.map((transaction) => ({
    ...transaction,
    category: categories.find((category) => category.id === transaction.categoryId) ?? null,
  }));
}

export function filterTransactions(
  transactions: StoredTransaction[],
  filters: TransactionFilters,
): StoredTransaction[] {
  return transactions.filter((transaction) => {
    if (filters.month !== undefined || filters.year !== undefined) {
      const transactionDate = new Date(transaction.date + 'T00:00:00');
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      if (filters.month !== undefined && transactionMonth !== filters.month) return false;
      if (filters.year !== undefined && transactionYear !== filters.year) return false;
    }

    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.categoryId && transaction.categoryId !== filters.categoryId) return false;

    if (filters.search) {
      const searchTermLower = filters.search.toLowerCase();
      const descriptionMatches =
        transaction.description?.toLowerCase().includes(searchTermLower) ?? false;
      if (!descriptionMatches) return false;
    }

    return true;
  });
}

export function sortTransactionsByDateDesc(
  transactions: StoredTransaction[],
): StoredTransaction[] {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
}

export function calculateMonthlySummary(
  transactions: StoredTransaction[],
  month: number,
  year: number,
) {
  const monthlyTransactions = filterTransactions(transactions, { month, year });

  const totalIncome = monthlyTransactions
    .filter((transaction) => transaction.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = monthlyTransactions
    .filter((transaction) => transaction.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: monthlyTransactions.length,
    month,
    year,
  };
}
