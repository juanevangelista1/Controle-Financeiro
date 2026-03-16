import { useMemo } from 'react';
import { useTransactionStore } from '@/domains/transactions/stores/transactionStore';
import { useCategoryStore } from '@/domains/categories/stores/categoryStore';
import { useFilterStore } from '@/shared/stores/filterStore';
import { calculateMonthlySummary } from '@/domains/transactions/services/transactionService';
import { buildCategoryBreakdown, buildYearlyOverview } from '../services/reportService';

export function useMonthlySummary() {
  const { transactions } = useTransactionStore();
  const { selectedMonth, selectedYear } = useFilterStore();

  return useMemo(
    () => calculateMonthlySummary(transactions, selectedMonth, selectedYear),
    [transactions, selectedMonth, selectedYear],
  );
}

export function useCategoryBreakdown() {
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { selectedMonth, selectedYear } = useFilterStore();

  return useMemo(
    () => buildCategoryBreakdown(transactions, categories, selectedMonth, selectedYear),
    [transactions, categories, selectedMonth, selectedYear],
  );
}

export function useYearlyOverview() {
  const { transactions } = useTransactionStore();
  const { selectedYear } = useFilterStore();

  return useMemo(
    () => buildYearlyOverview(transactions, selectedYear),
    [transactions, selectedYear],
  );
}
