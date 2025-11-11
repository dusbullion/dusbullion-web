"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "../lib/auth-context";
import { useUI } from "../store/ui";

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const { openAuth } = useUI();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-xl bg-neutral-200" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={() => openAuth("login")} className="btn-ghost cursor-pointer">Login</button>
        <button onClick={() => openAuth("register")} className="btn-secondary cursor-pointer">Register</button>
      </div>
    );
  }

  const name = user.displayName || user.email || "Account";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 hover:bg-neutral-100"
      >
        <div className="relative size-7 overflow-hidden rounded-full bg-neutral-200">
          {user.photoURL && (
            <Image src={user.photoURL} alt="avatar" fill className="object-cover" />
          )}
        </div>
        <span className="hidden text-sm font-medium sm:inline">{name}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          <a href="/account" className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100">My Account</a>
          <button
            onClick={async () => { await signOut(); setOpen(false); }}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
