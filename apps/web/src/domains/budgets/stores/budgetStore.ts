import { create } from 'zustand';
import * as budgetRepository from '../repositories/budgetRepository';
import type { StoredBudget } from '../types';

interface BudgetState {
  budgets: StoredBudget[];
  upsertBudget: (input: Omit<StoredBudget, 'id' | 'createdAt' | 'updatedAt'>) => StoredBudget;
  deleteBudget: (id: string) => void;
  refreshBudgets: () => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgets: budgetRepository.findAllBudgets(),

  upsertBudget: (input) => {
    const upserted = budgetRepository.upsertBudget(input);
    set((state) => {
      const existingIndex = state.budgets.findIndex(
        (budget) =>
          budget.categoryId === input.categoryId &&
          budget.month === input.month &&
          budget.year === input.year,
      );
      if (existingIndex !== -1) {
        return {
          budgets: state.budgets.map((budget, index) =>
            index === existingIndex ? upserted : budget,
          ),
        };
      }
      return { budgets: [...state.budgets, upserted] };
    });
    return upserted;
  },

  deleteBudget: (id) => {
    budgetRepository.removeBudget(id);
    set((state) => ({
      budgets: state.budgets.filter((budget) => budget.id !== id),
    }));
  },

  refreshBudgets: () => {
    set({ budgets: budgetRepository.findAllBudgets() });
  },
}));
