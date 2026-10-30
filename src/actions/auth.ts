"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import {
  FormState,
  RegisterFormSchema,
  RequestPasswordResetFormSchema,
  ResetPasswordFormSchema,
} from "@/lib/definitions";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/server/auth/email";
import { consumeToken, createToken } from "@/server/auth/tokens";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function register(
  _: unknown,
  formData: FormData,
): Promise<FormState> {
  // Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return {
        errors: {
          _form: ["User with this email already exists"],
        },
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    // The account exists at this point, so a failed email shouldn't fail the registration.
    // The user can request a new confirmation link from the login form.
    try {
      const token = await createToken("verify-email", email);
      if (token) await sendVerificationEmail(email, token);
    } catch (error) {
      console.error("Verification email error:", error);
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      errors: {
        _form: ["An error occurred during registration. Please try again."],
      },
    };
  }
}

export async function resendVerificationEmail(
  email: string,
): Promise<FormState> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Respond the same way whether or not the account exists to avoid leaking registered emails
    if (user?.password && !user.emailVerified) {
      const token = await createToken("verify-email", email);
      if (token) await sendVerificationEmail(email, token);
    }

    return { success: true };
  } catch (error) {
    console.error("Resend verification email error:", error);
    return {
      errors: {
        _form: ["Couldn't send the confirmation email. Please try again."],
      },
    };
  }
}

export async function requestPasswordReset(
  _: unknown,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = RequestPasswordResetFormSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Respond the same way whether or not the account exists to avoid leaking registered emails
    if (user) {
      const token = await createToken("reset-password", email);
      if (token) await sendPasswordResetEmail(email, token);
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      errors: {
        _form: ["Couldn't send the reset link. Please try again."],
      },
    };
  }
}

export async function resetPassword(
  _: unknown,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = ResetPasswordFormSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const { password } = validatedFields.error.flatten().fieldErrors;
    return {
      errors: password
        ? { password }
        : { _form: ["This reset link is invalid or has expired."] },
    };
  }

  const { token, password } = validatedFields.data;

  try {
    const email = await consumeToken("reset-password", token);

    if (!email) {
      return {
        errors: {
          _form: ["This reset link is invalid or has expired."],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Opening the link proves ownership of the address, so it also confirms the email
    await db
      .update(users)
      .set({
        password: hashedPassword,
        emailVerified: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      errors: {
        _form: [
          "An error occurred while resetting your password. Please try again.",
        ],
      },
    };
  }
}
