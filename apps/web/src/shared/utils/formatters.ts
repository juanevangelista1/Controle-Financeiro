import { CURRENCY_CONFIG } from '@controle-financeiro/shared';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(CURRENCY_CONFIG.locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(CURRENCY_CONFIG.locale, {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function getMonthName(month: number): string {
  const date = new Date(2000, month - 1, 1);
  return new Intl.DateTimeFormat(CURRENCY_CONFIG.locale, { month: 'long' }).format(date);
}

export function getCurrentDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function generateYearOptions(rangeSize: number = 5): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: rangeSize }, (_, index) => currentYear - index);
}
