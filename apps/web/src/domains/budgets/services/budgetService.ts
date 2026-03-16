import { TRANSACTION_TYPES } from '@controle-financeiro/shared';
import type { StoredCategory } from '@/domains/categories/types';
import type { StoredTransaction } from '@/domains/transactions/types';
import type { StoredBudget, BudgetWithDetails } from '../types';

export function calculateBudgetSpent(
  budget: StoredBudget,
  transactions: StoredTransaction[],
): number {
  const monthPadded = String(budget.month).padStart(2, '0');
  const periodPrefix = `${budget.year}-${monthPadded}`;

  return transactions
    .filter(
      (transaction) =>
        transaction.type === TRANSACTION_TYPES.EXPENSE &&
        transaction.categoryId === budget.categoryId &&
        transaction.date.startsWith(periodPrefix),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function calculateBudgetPercentage(spent: number, budgetAmount: number): number {
  if (budgetAmount <= 0) return 0;
  return Math.min(Math.round((spent / budgetAmount) * 100), 100);
}

export function enrichBudgetsWithDetails(
  budgets: StoredBudget[],
  categories: StoredCategory[],
  transactions: StoredTransaction[],
): BudgetWithDetails[] {
  return budgets.map((budget) => {
    const spent = calculateBudgetSpent(budget, transactions);
    const percentage = calculateBudgetPercentage(spent, budget.amount);
    const category = categories.find((cat) => cat.id === budget.categoryId) ?? null;
    return { ...budget, category, spent, percentage };
  });
}
