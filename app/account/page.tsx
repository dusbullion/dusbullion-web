"use client";

import { useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/"); // redirect guests
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="section py-12">Loading…</div>;
  }

  return (
    <section className="section space-y-6 py-8">
      <h1 className="text-2xl font-semibold">My Account</h1>
      <div className="card">
        <p className="text-sm text-neutral-700">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
      </div>
    </section>
  );
}