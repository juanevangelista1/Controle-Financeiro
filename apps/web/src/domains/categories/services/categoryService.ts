import type { StoredCategory } from '../types';

export function sortCategoriesByName(categories: StoredCategory[]): StoredCategory[] {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export function isCategoryNameDuplicate(
  categories: StoredCategory[],
  name: string,
  excludeId?: string,
): boolean {
  return categories.some(
    (category) =>
      category.name.toLowerCase() === name.toLowerCase() && category.id !== excludeId,
  );
}
