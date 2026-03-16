import { STORAGE_KEYS } from '@/shared/storage/storageKeys';
import { getAllFromStorage, saveAllToStorage } from '@/shared/storage/storageService';
import { generateId } from '@/shared/utils/idGenerator';
import type { StoredBudget } from '../types';

export function findAllBudgets(): StoredBudget[] {
  return getAllFromStorage<StoredBudget>(STORAGE_KEYS.BUDGETS);
}

export function findBudgetsByMonthYear(month: number, year: number): StoredBudget[] {
  return findAllBudgets().filter((budget) => budget.month === month && budget.year === year);
}

export function findBudgetById(id: string): StoredBudget | null {
  return findAllBudgets().find((budget) => budget.id === id) ?? null;
}

export function upsertBudget(
  input: Omit<StoredBudget, 'id' | 'createdAt' | 'updatedAt'>,
): StoredBudget {
  const budgets = findAllBudgets();
  const existingIndex = budgets.findIndex(
    (budget) =>
      budget.categoryId === input.categoryId &&
      budget.month === input.month &&
      budget.year === input.year,
  );
  const now = new Date().toISOString();

  if (existingIndex !== -1) {
    const updated: StoredBudget = {
      ...budgets[existingIndex],
      amount: input.amount,
      updatedAt: now,
    };
    saveAllToStorage(
      STORAGE_KEYS.BUDGETS,
      budgets.map((budget, index) => (index === existingIndex ? updated : budget)),
    );
    return updated;
  }

  const newBudget: StoredBudget = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  saveAllToStorage(STORAGE_KEYS.BUDGETS, [...budgets, newBudget]);
  return newBudget;
}

export function removeBudget(id: string): boolean {
  const budgets = findAllBudgets();
  const exists = budgets.some((budget) => budget.id === id);
  if (!exists) return false;
  saveAllToStorage(
    STORAGE_KEYS.BUDGETS,
    budgets.filter((budget) => budget.id !== id),
  );
  return true;
}
