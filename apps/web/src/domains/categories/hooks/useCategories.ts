import { useCategoryStore } from '../stores/categoryStore';
import { sortCategoriesByName } from '../services/categoryService';
import type { StoredCategory } from '../types';

export function useCategories(type?: StoredCategory['type']) {
  const { categories, addCategory, editCategory, deleteCategory } = useCategoryStore();

  const filteredCategories =
    type !== undefined ? categories.filter((category) => category.type === type) : categories;

  return {
    categories: sortCategoriesByName(filteredCategories),
    addCategory,
    editCategory,
    deleteCategory,
  };
}
