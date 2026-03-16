import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useBudgetStore } from '../stores/budgetStore';
import { useCategoryStore } from '@/domains/categories/stores/categoryStore';
import { useTransactionStore } from '@/domains/transactions/stores/transactionStore';
import { enrichBudgetsWithDetails } from '../services/budgetService';
import { useFilterStore } from '@/shared/stores/filterStore';
import type { StoredBudget } from '../types';

export function useBudgets() {
  const { budgets, upsertBudget, deleteBudget } = useBudgetStore();
  const { categories } = useCategoryStore();
  const { transactions } = useTransactionStore();
  const { selectedMonth, selectedYear } = useFilterStore();

  const budgetsForCurrentPeriod = useMemo(
    () => budgets.filter((budget) => budget.month === selectedMonth && budget.year === selectedYear),
    [budgets, selectedMonth, selectedYear],
  );

  const enrichedBudgets = useMemo(
    () => enrichBudgetsWithDetails(budgetsForCurrentPeriod, categories, transactions),
    [budgetsForCurrentPeriod, categories, transactions],
  );

  function handleUpsertBudget(input: Omit<StoredBudget, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const result = upsertBudget(input);
      toast.success('Orçamento salvo com sucesso!');
      return result;
    } catch (error) {
      toast.error('Erro ao salvar orçamento.');
      throw error;
    }
  }

  function handleDeleteBudget(id: string) {
    try {
      deleteBudget(id);
      toast.success('Orçamento removido.');
    } catch (error) {
      toast.error('Erro ao remover orçamento.');
      throw error;
    }
  }

  return {
    budgets: enrichedBudgets,
    upsertBudget: handleUpsertBudget,
    deleteBudget: handleDeleteBudget,
  };
}
