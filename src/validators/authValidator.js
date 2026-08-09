import { z } from 'zod';

const registrationSchema = z.object({
  email: z.email().min(1, 'Email is required'),
  nickname: z
    .string()
    .min(3, 'nickname must be between 3 and 20 characters')
    .max(20, 'nickname must be between 3 and 20 symbols'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  loginIdentifier: z.string().min(1, 'Please, enter login or email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export { registrationSchema, loginSchema };
