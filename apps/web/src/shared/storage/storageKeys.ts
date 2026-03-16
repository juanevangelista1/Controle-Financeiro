export const STORAGE_KEYS = {
  TRANSACTIONS: 'controle_financeiro_transactions',
  CATEGORIES: 'controle_financeiro_categories',
  BUDGETS: 'controle_financeiro_budgets',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
