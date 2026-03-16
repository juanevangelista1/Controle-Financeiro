import { create } from 'zustand';
import * as categoryRepository from '../repositories/categoryRepository';
import type { StoredCategory } from '../types';

interface CategoryState {
  categories: StoredCategory[];
  addCategory: (input: Omit<StoredCategory, 'id' | 'createdAt'>) => StoredCategory;
  editCategory: (id: string, input: Partial<Omit<StoredCategory, 'id' | 'createdAt'>>) => void;
  deleteCategory: (id: string) => boolean;
  refreshCategories: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: categoryRepository.findAllCategories(),

  addCategory: (input) => {
    const created = categoryRepository.insertCategory(input);
    set((state) => ({ categories: [...state.categories, created] }));
    return created;
  },

  editCategory: (id, input) => {
    categoryRepository.updateCategory(id, input);
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...input } : category,
      ),
    }));
  },

  deleteCategory: (id) => {
    const wasRemoved = categoryRepository.removeCategory(id);
    if (wasRemoved) {
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      }));
    }
    return wasRemoved;
  },

  refreshCategories: () => {
    set({ categories: categoryRepository.findAllCategories() });
  },
}));
