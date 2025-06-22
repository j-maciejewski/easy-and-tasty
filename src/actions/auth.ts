"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { FormState, RegisterFormSchema } from "@/lib/definitions";
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
