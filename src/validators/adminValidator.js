import { z } from 'zod';

export const updateNicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(3, 'Nickname must be at least 3 characters')
    .max(20, 'Nickname must be at most 20 characters'),
});

export const updateStatusSchema = z.object({
  status: z.enum(['active', 'banned'], {
    errorMap: () => ({ message: 'Status must be either "active" or "banned"' }),
  }),
});
