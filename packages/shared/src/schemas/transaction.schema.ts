import { z } from 'zod';
import { TRANSACTION_TYPES } from '../constants';

export const transactionTypeSchema = z.enum([
  TRANSACTION_TYPES.INCOME,
  TRANSACTION_TYPES.EXPENSE,
]);

export const createTransactionSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be a positive number')
    .max(999999999.99, 'Amount exceeds maximum allowed value'),
  type: transactionTypeSchema,
  description: z
    .string()
    .max(255, 'Description must be 255 characters or less')
    .optional()
    .nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  categoryId: z.string().min(1, 'Category is required'),
  isRecurring: z.boolean().optional().default(false),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  type: transactionTypeSchema.optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
