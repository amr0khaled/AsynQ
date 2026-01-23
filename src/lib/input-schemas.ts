import z from 'zod'

export const loginFormSchema = z.object({
  email: z.email()
    .min(6, 'Email must be at least 6 characters'),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters")
})
export const signupFormSchema = z.object({
  email: z.email()
    .min(6, 'Email must be at least 6 characters'),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
  name: z.string(),
})
export const signupServerSchema = z.object({
  email: z.email()
    .min(6, 'Email must be at least 6 characters'),
  name: z.string(),
})

export const newPostServerSchema = z.object({
  prompt: z.string(),
  content: z.string()
})
export const updatePostServerSchema = z.object({
  id: z.string(),
  content: z.string()
})
