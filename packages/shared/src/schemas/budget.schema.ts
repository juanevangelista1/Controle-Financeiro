import { z } from 'zod';

export const createBudgetSchema = z.object({
  amount: z
    .number()
    .positive('Budget amount must be positive')
    .max(999999999.99, 'Amount exceeds maximum allowed value'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  categoryId: z.string().min(1, 'Category is required'),
});

export const updateBudgetSchema = createBudgetSchema.partial().omit({
  categoryId: true,
  month: true,
  year: true,
});

export const budgetQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type BudgetQueryInput = z.infer<typeof budgetQuerySchema>;
