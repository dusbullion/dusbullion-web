// app/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth-context";
import { useUI } from "../store/ui";
import {
  emptyProfile,
  loadUserProfile,
  saveUserProfile,
  type UserProfile,
} from "../lib/profile-store";
import { sendVerificationEmail } from "../lib/auth-email";
import { getClientAuth } from "../lib/firebase";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-neutral-900 sm:text-lg">
      {children}
    </h2>
  );
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const { openAuth } = useUI();

  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load profile when user is ready
  useEffect(() => {
    if (!user || loaded) return;
    (async () => {
      try {
        const data = await loadUserProfile(user.uid);
        setProfile(data);
        setLoaded(true);
      } catch (e) {
        console.error(e);
        setError("Unable to load your profile. Please try again.");
      }
    })();
  }, [user, loaded]);

  // Keep shipping in sync if "same as billing" is checked
  useEffect(() => {
    if (!sameAsBilling) return;
    setProfile((prev) => ({
      ...prev,
      shipping: { ...prev.billing },
    }));
  }, [sameAsBilling]);

  // Helpers to update nested fields
  function updateField<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function updateAddress(
    type: "billing" | "shipping",
    field: string,
    value: string
  ) {
    setProfile((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      openAuth("login");
      return;
    }

    // 🚨 Block saving if email is not verified
    // if (!user.emailVerified) {
    //   alert("Please verify your email before saving your profile.");
    //   return;
    // }

    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const finalProfile = sameAsBilling
        ? { ...profile, shipping: { ...profile.billing } }
        : profile;

      await saveUserProfile(user.uid, finalProfile);
      setMessage("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Not signed in → ask to log in
  if (!loading && !user) {
    return (
      <section className="section py-10">
        <h1 className="text-2xl font-semibold">My Account</h1>
        <p className="mt-3 text-sm text-neutral-700">
          Please log in to view and edit your profile information.
        </p>
        <button
          className="btn-secondary mt-4"
          onClick={() => openAuth("login")}
        >
          Login
        </button>
      </section>
    );
  }

  return (
    <section className="section py-8">
      <h1 className="text-2xl font-semibold">My Account</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Manage your personal details, billing, and delivery addresses used at checkout.
      </p>

      {/* 🔔 Email verification banner */}
      {/* {user && !user.emailVerified && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            Your email is not verified.
          </p>
          <p className="mt-1 text-xs text-amber-800">
            Please check your inbox and click the verification link before updating your profile.
          </p>

          <button
            type="button"
            className="mt-3 rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
            onClick={async () => {
              try {
                const auth = getClientAuth();
                if (!auth?.currentUser) return;
                await sendVerificationEmail(auth.currentUser);
                alert("Verification email sent! Check your inbox.");
              } catch (err) {
                console.error(err);
                alert("Unable to send verification email. Please try again.");
              }
            }}
          >
            Resend verification email
          </button>
        </div>
      )} */}

      <form
        onSubmit={handleSave}
        className="mt-6 space-y-8 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6"
      >
        {/* Status messages */}
        {message && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Personal info */}
        <section className="space-y-4">
          <SectionTitle>Personal information</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700">
                First name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                value={profile.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">
                Last name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                value={profile.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
                value={user?.email ?? ""}
                disabled
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">
                Phone (optional)
              </label>
              <input
                type="tel"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                value={profile.phone ?? ""}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Billing address */}
        <section className="space-y-4">
          <SectionTitle>Billing address</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700">
                Full name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                value={profile.billing.fullName}
                onChange={(e) =>
                  updateAddress("billing", "fullName", e.target.value)
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700">
                Address line 1
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                value={profile.billing.line1}
                onChange={(e) =>
                  updateAddress("billing", "line1", e.target.value)
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700">
                Address line 2 (optional)
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                value={profile.billing.line2 ?? ""}
                onChange={(e) =>
                  updateAddress("billing", "line2", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">
                City
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                value={profile.billing.city}
                onChange={(e) =>
                  updateAddress("billing", "city", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">
                State / Province
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                value={profile.billing.state}
                onChange={(e) =>
                  updateAddress("billing", "state", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">
                Postal code
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                value={profile.billing.postalCode}
                onChange={(e) =>
                  updateAddress("billing", "postalCode", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">
                Country
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                value={profile.billing.country}
                onChange={(e) =>
                  updateAddress("billing", "country", e.target.value)
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700">
                Phone (for delivery updates)
              </label>
              <input
                type="tel"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                value={profile.billing.phone ?? ""}
                onChange={(e) =>
                  updateAddress("billing", "phone", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* Shipping address */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>Delivery address</SectionTitle>
            <label className="inline-flex items-center gap-2 text-xs text-neutral-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300"
                checked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
              />
              Same as billing address
            </label>
          </div>

          {!sameAsBilling && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Full name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  value={profile.shipping.fullName}
                  onChange={(e) =>
                    updateAddress("shipping", "fullName", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Address line 1
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  value={profile.shipping.line1}
                  onChange={(e) =>
                    updateAddress("shipping", "line1", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Address line 2 (optional)
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  value={profile.shipping.line2 ?? ""}
                  onChange={(e) =>
                    updateAddress("shipping", "line2", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  City
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  value={profile.shipping.city}
                  onChange={(e) =>
                    updateAddress("shipping", "city", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  State / Province
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  value={profile.shipping.state}
                  onChange={(e) =>
                    updateAddress("shipping", "state", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  Postal code
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  value={profile.shipping.postalCode}
                  onChange={(e) =>
                    updateAddress("shipping", "postalCode", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  Country
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  value={profile.shipping.country}
                  onChange={(e) =>
                    updateAddress("shipping", "country", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Phone (for delivery updates)
                </label>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  value={profile.shipping.phone ?? ""}
                  onChange={(e) =>
                    updateAddress("shipping", "phone", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-secondary px-6 py-2 text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </section>
  );
}
