// app/lib/profile-store.ts
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type Timestamp,
  type FieldValue,
} from "firebase/firestore";
import { getClientDb } from "./firebase";

/* ---------- Types ---------- */

export type Address = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type UserProfile = {
  // Personal
  firstName: string;
  lastName: string;
  phone?: string;

  // Addresses
  billing: Address;
  shipping: Address;

  // Meta (can be Timestamp from Firestore OR serverTimestamp() placeholder)
  createdAt?: Timestamp | FieldValue | null;
  updatedAt?: Timestamp | FieldValue | null;
};

/* ---------- Empty defaults ---------- */

export const emptyAddress: Address = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
};

export const emptyProfile: UserProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  billing: { ...emptyAddress },
  shipping: { ...emptyAddress },
  createdAt: null,
  updatedAt: null,
};

/* ---------- Helpers ---------- */

function mergeAddress(base: Address, partial?: Partial<Address>): Address {
  return {
    ...base,
    ...(partial || {}),
  };
}

function mergeProfile(snapshotData: Partial<UserProfile> | undefined): UserProfile {
  if (!snapshotData) return { ...emptyProfile };

  return {
    ...emptyProfile,
    ...snapshotData,
    billing: mergeAddress(emptyProfile.billing, snapshotData.billing),
    shipping: mergeAddress(emptyProfile.shipping, snapshotData.shipping),
  };
}

/* ---------- Firestore operations ---------- */

/**
 * Load the profile for a given user.
 * If no document exists, returns an "empty" profile object.
 */
export async function loadUserProfile(uid: string): Promise<UserProfile> {
  const db = getClientDb();
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // No profile yet → just return empty defaults
    return { ...emptyProfile };
  }

  const data = snap.data() as Partial<UserProfile>;
  return mergeProfile(data);
}

/**
 * Save / update the profile for a user.
 * This merges with any existing fields and updates timestamps.
 */
export async function saveUserProfile(
  uid: string,
  profile: UserProfile
): Promise<void> {
  const db = getClientDb();
  const ref = doc(db, "users", uid);

  const payload: Partial<UserProfile> = {
    ...profile,
    updatedAt: serverTimestamp(),
  };

  // On first save, also set createdAt (and keep it on merges)
  if (!profile.createdAt) {
    (payload as any).createdAt = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
}
