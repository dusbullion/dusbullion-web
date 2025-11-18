// app/lib/auth-email.ts
"use client";

import { sendEmailVerification, type User } from "firebase/auth";

/**
 * Send verification link to a newly created user.
 * You call this right after createUserWithEmailAndPassword.
 */
export async function sendVerificationEmail(user: User) {
  if (!user) return;

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://dusbullion.com";

  // This is where users will land after clicking the email link
  const continueUrl = `${origin}/verify-email`;

  await sendEmailVerification(user, {
    url: continueUrl,
    handleCodeInApp: false, // you can make this true later for advanced flows
  });
}
