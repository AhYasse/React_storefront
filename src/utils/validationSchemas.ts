import { z } from 'zod';
import DOMPurify from 'dompurify';

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

// 3. CHECKOUT SCHEMA (With DOMPurify Sanitization)

export const checkoutSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  
  // DOMPurify sanitization applied directly in the schema via .transform()
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .transform((val) => DOMPurify.sanitize(val)),
    
  cardNumber: z.string()
    .min(1, 'Card number is required')
    .regex(/^\d{16}$/, 'Card number must be 16 digits'),
    
  expiry: z.string()
    .min(1, 'Expiry is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry format (MM/YY)'),
    cvc: z.string()
    .min(1, 'CVC is required')
    .regex(/^\d{3,4}$/, 'Invalid CVC'),
});

// z.infer correctly infers the output type (string) even after the transform
export type CheckoutFormData = z.infer<typeof checkoutSchema>;