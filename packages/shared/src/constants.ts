export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

export const MONTHS = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Fev' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Abr' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Ago' },
  { value: 9, label: 'Set' },
  { value: 10, label: 'Out' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dez' },
] as const;

export const DEFAULT_CATEGORIES = {
  EXPENSE: [
    { name: 'Alimentação', icon: 'utensils', color: '#EF4444' },
    { name: 'Transporte', icon: 'car', color: '#F97316' },
    { name: 'Moradia', icon: 'home', color: '#8B5CF6' },
    { name: 'Saúde', icon: 'heart-pulse', color: '#EC4899' },
    { name: 'Educação', icon: 'graduation-cap', color: '#3B82F6' },
    { name: 'Lazer', icon: 'gamepad-2', color: '#10B981' },
    { name: 'Vestuário', icon: 'shirt', color: '#F59E0B' },
    { name: 'Assinaturas', icon: 'repeat', color: '#6366F1' },
    { name: 'Outros', icon: 'ellipsis', color: '#6B7280' },
  ],
  INCOME: [
    { name: 'Salário', icon: 'banknote', color: '#10B981' },
    { name: 'Plantão SAMU', icon: 'ambulance', color: '#EF4444' },
    { name: 'Aeromédico', icon: 'plane', color: '#3B82F6' },
    { name: 'UPA', icon: 'hospital', color: '#F97316' },
    { name: 'Freelance', icon: 'laptop', color: '#6366F1' },
    { name: 'Investimentos', icon: 'trending-up', color: '#8B5CF6' },
    { name: 'Outros', icon: 'ellipsis', color: '#6B7280' },
  ],
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CURRENCY_CONFIG = {
  locale: 'pt-BR',
  currency: 'BRL',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
