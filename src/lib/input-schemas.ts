'use client'
import z from 'zod'

export const loginFormSchema = z.object({
  email: z.email()
    .min(6, 'Email must be at least 6 characters'),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters")
})
