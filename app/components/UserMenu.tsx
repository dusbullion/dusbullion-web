"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import { useUI } from "../store/ui";

function initialsFromUser(u: { displayName?: string | null; email?: string | null }) {
  if (u?.displayName) {
    const parts = u.displayName.trim().split(/\s+/).slice(0, 2);
    const ini = parts.map((p) => p[0]?.toUpperCase() || "").join("");
    if (ini) return ini;
  }
  const email = u?.email ?? "U";
  const base = email.split("@")[0] || "U";
  return base.slice(0, 2).toUpperCase();
}

// function initialsFromUser(email?: string | null) {
//   if (!email) return "U";
//   const base = email.split("@")[0] || "U";
//   return base.slice(0, 2).toUpperCase();
// }

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const { openAuth } = useUI();
  const [open, setOpen] = useState(false);

  // Loading skeleton (brief)
  if (loading) {
    return <div className="h-9 w-28 animate-pulse rounded-xl bg-neutral-200" />;
  }

  // Signed out
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={() => openAuth("login")} className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100">
          Login
        </button>
        <button onClick={() => openAuth("register")} className="rounded-xl bg-[#c89f48] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Register
        </button>
      </div>
    );
  }

  // Signed in
  const name = user.displayName || user.email || "Account";
  const initials = initialsFromUser(user);

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 hover:bg-neutral-50"
      >
        <div className="grid size-8 place-items-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-100 text-xs font-semibold">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="avatar" className="size-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="hidden lg:inline text-sm font-medium">{name}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          <Link href="/account" className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100" role="menuitem">
            My Account
          </Link>
          <button
            onClick={async () => { await signOut(); setOpen(false); }}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
