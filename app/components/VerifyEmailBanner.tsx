// app/components/VerifyEmailBanner.tsx
"use client";

import { useState } from "react";
import { getClientAuth } from "../lib/firebase";
import { sendVerificationEmail } from "../lib/auth-email";

export default function VerifyEmailBanner() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleResend() {
    const auth = getClientAuth();
    const user = auth?.currentUser;

    if (!user) {
      setStatus("error");
      setMessage("You need to be logged in to resend verification.");
      return;
    }

    try {
      setStatus("sending");
      setMessage("");
      await sendVerificationEmail(user);
      setStatus("sent");
      setMessage("Verification email sent. Please check your inbox.");
    } catch (e: any) {
      console.error(e);
      setStatus("error");
      setMessage("Unable to send verification email. Please try again.");
    }
  }

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-medium">
        Please verify your email address to fully activate your account.
      </p>
      <p className="mt-1">
        Click the link in the email we sent you, or resend the verification
        email below.
      </p>
      <button
        type="button"
        onClick={handleResend}
        disabled={status === "sending"}
        className="mt-3 rounded-lg border border-amber-400 px-3 py-1.5 text-xs font-medium hover:bg-amber-100"
      >
        {status === "sending" ? "Sending…" : "Resend verification email"}
      </button>
      {message && (
        <p className="mt-2 text-xs">
          {message}
        </p>
      )}
    </div>
  );
}
