// app/components/AuthModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import { useUI } from "../store/ui";
import { getClientAuth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { sendVerificationEmail } from "../lib/auth-email";

export default function AuthModal() {
  const { authOpen, initialTab, closeAuth } = useUI();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // keep tab in sync if modal is opened with a different initialTab
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, authOpen]);

  const auth = useMemo(() => getClientAuth(), [authOpen]);

  function resetForm() {
    setEmail("");
    setPassword("");
    setName("");
    setErr("");
    setInfo("");
    setShow(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setInfo("");
    if (!auth) {
      setErr("Auth not available. Please refresh and try again.");
      return;
    }
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // If email is not verified, block and send verification mail
      // if (!cred.user.emailVerified) {
      //   await sendVerificationEmail(cred.user);
      //   await signOut(auth);
      //   setInfo(
      //     "We sent you a verification email. Please click the link in your inbox before signing in."
      //   );
      //   return;
      // }

      resetForm();
      closeAuth();
    } catch (e: any) {
      setErr(parseFirebaseError(e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setInfo("");
    if (!auth) {
      setErr("Auth not available. Please refresh and try again.");
      return;
    }
    setLoading(true);
    try {
      // 1) Create user
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // 2) Optional: set display name
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }

      // 3) Send verification email
      //await sendVerificationEmail(cred.user);

      // 4) Optionally sign them out so they must verify first
      await signOut(auth);

      // setInfo(
      //   "Account created! Please check your email and click the verification link before logging in."
      // );

      // optional: move them automatically to login tab
      setTab("login");
      resetForm();
      // You can decide whether to close modal or keep it open.
      // Here we keep it open so they can read the message.
      // closeAuth();
    } catch (e: any) {
      setErr(parseFirebaseError(e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot() {
    setErr("");
    setInfo("");
    if (!auth) {
      setErr("Auth not available. Please refresh and try again.");
      return;
    }
    if (!email.trim()) {
      setErr("Enter your email above, then click Forgot password.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("Password reset email sent. Check your inbox.");
    } catch (e: any) {
      setErr(parseFirebaseError(e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setErr("");
    setInfo("");
    if (!auth) {
      setErr("Auth not available. Please refresh and try again.");
      return;
    }
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      resetForm();
      closeAuth();
    } catch (e: any) {
      setErr(parseFirebaseError(e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={authOpen}
      onClose={() => {
        if (!loading) {
          resetForm();
          closeAuth();
        }
      }}
      ariaLabel="Sign in or create account"
      widthClass="max-w-lg"
    >
      {/* Tabs */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
        <button
          onClick={() => setTab("login")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            tab === "login" ? "bg-white shadow" : "text-neutral-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setTab("register")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            tab === "register" ? "bg-white shadow" : "text-neutral-600"
          }`}
        >
          Register
        </button>
      </div>

      {/* Body */}
      {tab === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              placeholder="you@example.com"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center gap-2">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-white"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <button
              type="button"
              onClick={handleForgot}
              className="mt-1 text-left text-xs font-medium text-blue-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {info && <p className="text-sm text-green-700">{info}</p>}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={closeAuth} className="btn-ghost">
              Cancel
            </button>
            <button disabled={loading || !auth} className="btn-primary">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>

          {/* Google (optional) */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="h-px w-full bg-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-neutral-500">
                or
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={!auth || loading}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Continue with Google
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Full name (optional)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-300 px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center gap-2">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-white"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {info && <p className="text-sm text-green-700">{info}</p>}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={closeAuth} className="btn-ghost">
              Cancel
            </button>
            <button disabled={loading || !auth} className="btn-primary">
              {loading ? "Creating…" : "Create account"}
            </button>
          </div>

          {/* Google (optional) */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="h-px w-full bg-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-neutral-500">
                or
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={!auth || loading}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Continue with Google
          </button>
        </form>
      )}
    </Modal>
  );
}

/* ---------- helpers ---------- */

function parseFirebaseError(msg: string): string {
  // Humanize common Firebase error messages
  if (msg.includes("auth/invalid-credential"))
    return "Invalid email or password.";
  if (msg.includes("auth/user-not-found"))
    return "No account found with this email.";
  if (msg.includes("auth/wrong-password"))
    return "Wrong password. Try again.";
  if (msg.includes("auth/email-already-in-use"))
    return "This email is already registered.";
  if (msg.includes("auth/too-many-requests"))
    return "Too many attempts. Please wait and try again.";
  if (msg.includes("auth/network-request-failed"))
    return "Network error. Check your connection.";
  return msg.replace("Firebase: ", "");
}
