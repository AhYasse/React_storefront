import { z } from 'zod';

// 1. LOGIN SCHEMA

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Infer TypeScript type from the Zod schema
export type LoginFormData = z.infer<typeof loginSchema>;

// 2. REGISTER SCHEMA

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  // Custom validation to ensure passwords match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Attach error to the confirmPassword field
  });

// Infer TypeScript type from the Zod schema
export type RegisterFormData = z.infer<typeof registerSchema>;