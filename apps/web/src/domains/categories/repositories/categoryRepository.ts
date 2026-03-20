import { STORAGE_KEYS } from '@/shared/storage/storageKeys';
import { getAllFromStorage, saveAllToStorage } from '@/shared/storage/storageService';
import { generateId } from '@/shared/utils/idGenerator';
import { DEFAULT_CATEGORIES, TRANSACTION_TYPES } from '@controle-financeiro/shared';
import type { StoredCategory } from '../types';

export function findAllCategories(): StoredCategory[] {
  return getAllFromStorage<StoredCategory>(STORAGE_KEYS.CATEGORIES);
}

export function findCategoriesByType(type: StoredCategory['type']): StoredCategory[] {
  return findAllCategories().filter((category) => category.type === type);
}

export function findCategoryById(id: string): StoredCategory | null {
  return findAllCategories().find((category) => category.id === id) ?? null;
}

export function insertCategory(
  input: Omit<StoredCategory, 'id' | 'createdAt'>,
): StoredCategory {
  const existingCategories = findAllCategories();
  const newCategory: StoredCategory = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  saveAllToStorage(STORAGE_KEYS.CATEGORIES, [...existingCategories, newCategory]);
  return newCategory;
}

export function updateCategory(
  id: string,
  input: Partial<Omit<StoredCategory, 'id' | 'createdAt'>>,
): StoredCategory | null {
  const categories = findAllCategories();
  const targetIndex = categories.findIndex((category) => category.id === id);
  if (targetIndex === -1) return null;

  const updatedCategory: StoredCategory = { ...categories[targetIndex], ...input };
  const updatedCategories = categories.map((category) =>
    category.id === id ? updatedCategory : category,
  );
  saveAllToStorage(STORAGE_KEYS.CATEGORIES, updatedCategories);
  return updatedCategory;
}

export function removeCategory(id: string): boolean {
  const categories = findAllCategories();
  const target = categories.find((category) => category.id === id);
  if (!target || target.isDefault) return false;

  saveAllToStorage(
    STORAGE_KEYS.CATEGORIES,
    categories.filter((category) => category.id !== id),
  );
  return true;
}

export function seedDefaultCategories(): void {
  const existingCategories = findAllCategories();
  const now = new Date().toISOString();

  if (existingCategories.length === 0) {
    const expenseCategories: StoredCategory[] = DEFAULT_CATEGORIES.EXPENSE.map((cat) => ({
      id: generateId(),
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      type: TRANSACTION_TYPES.EXPENSE,
      isDefault: true,
      createdAt: now,
    }));

    const incomeCategories: StoredCategory[] = DEFAULT_CATEGORIES.INCOME.map((cat) => ({
      id: generateId(),
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      type: TRANSACTION_TYPES.INCOME,
      isDefault: true,
      createdAt: now,
    }));

    saveAllToStorage(STORAGE_KEYS.CATEGORIES, [...expenseCategories, ...incomeCategories]);
    return;
  }

  // Add any missing default categories for existing installations
  const existingNames = new Set(existingCategories.map((c) => c.name.toLowerCase()));
  const allDefaults = [
    ...DEFAULT_CATEGORIES.EXPENSE.map((cat) => ({ ...cat, type: TRANSACTION_TYPES.EXPENSE })),
    ...DEFAULT_CATEGORIES.INCOME.map((cat) => ({ ...cat, type: TRANSACTION_TYPES.INCOME })),
  ];

  const missingDefaults: StoredCategory[] = allDefaults
    .filter((cat) => !existingNames.has(cat.name.toLowerCase()))
    .map((cat) => ({
      id: generateId(),
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      type: cat.type,
      isDefault: true,
      createdAt: now,
    }));

  if (missingDefaults.length > 0) {
    saveAllToStorage(STORAGE_KEYS.CATEGORIES, [...existingCategories, ...missingDefaults]);
  }
}
