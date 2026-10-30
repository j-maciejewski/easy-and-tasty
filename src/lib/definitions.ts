import { z } from "zod";

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        _form?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

const EmailSchema = z
  .string()
  .email({ message: "Please enter a valid email." })
  .trim();

const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-zA-Z]/, {
    message: "Password must contain at least one letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character.",
  })
  .trim();

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: EmailSchema,
  password: PasswordSchema,
});

export const RequestPasswordResetFormSchema = z.object({
  email: EmailSchema,
});

export const ResetPasswordFormSchema = z.object({
  token: z.string().min(1),
  password: PasswordSchema,
});
