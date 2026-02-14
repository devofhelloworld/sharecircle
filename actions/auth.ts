"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

function isRedirectError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password" };
    }

    console.error("loginUser error:", error);
    return {
      success: false,
      error: "Login failed",
    };
  }
}

export async function loginWithGoogle(idToken: string) {
  try {
    if (!idToken) {
      return { success: false, error: "Missing Google token" };
    }

    await signIn("firebase-google", {
      idToken,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { success: false, error: "Google sign-in failed" };
    }

    console.error("loginWithGoogle error:", error);
    return { success: false, error: "Google sign-in failed" };
  }
}

export async function registerUser(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const confirmPassword = formData.get("confirmPassword") as string | null;

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      credits: 0,
    });

    return { success: true };
  } catch (error) {
    console.error("registerUser error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}
