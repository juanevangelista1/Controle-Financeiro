import { z } from 'zod';
import { TRANSACTION_TYPES } from '../constants';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be 50 characters or less'),
  icon: z.string().optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional()
    .nullable(),
  type: z.enum([TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE]),
});

export const updateCategorySchema = createCategorySchema.partial().omit({ type: true });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
