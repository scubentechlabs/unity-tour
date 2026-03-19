import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long")
  .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, dots, hyphens");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email is too long");

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^\d+$/, "Phone number must contain only digits")
  .min(10, "Phone number must be at least 10 digits")
  .max(10, "Phone number must be exactly 10 digits");

export const messageSchema = z
  .string()
  .trim()
  .max(1000, "Message is too long")
  .optional();

// Helper to allow only numeric input
export const onlyNumbers = (value: string) => value.replace(/\D/g, "");

// Validate and return errors map from zod result
export const getValidationErrors = (result: z.SafeParseReturnType<any, any>): Record<string, string> => {
  if (result.success) return {};
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    if (err.path[0]) {
      errors[err.path[0] as string] = err.message;
    }
  });
  return errors;
};
