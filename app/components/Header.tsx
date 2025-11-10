// components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "../store/ui";
import { useCart } from "../store/cart";
import TopBar from "./TopBar";

export default function Header() {
    const { openAuth } = useUI();
    const [open, setOpen] = useState(false);
    const cartCount = useCart?.((s) => s.count?.() ?? 0) ?? 0;

    useEffect(() => {
        const html = document.documentElement;
        if (open) {
            const prev = html.style.overflow;
            html.style.overflow = "hidden";
            return () => { html.style.overflow = prev; };
        }
    }, [open]);

    return (
        <header className="sticky top-0 z-40 border-b border-neutral-200 glass">
            <TopBar />
            <div className="section flex items-center justify-between py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative h-10 w-24 md:h-14 md:w-36">
                        <Image src="/transparent-gold-logo.png" alt="dusbullion logo" fill className="object-contain" priority />
                    </div>
                    {/* <span className="text-lg font-semibold tracking-tight md:text-xl">dusbullion.com</span> */}
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-6 text-sm md:flex">
                    <Link href="/products" className="hover:text-black/70">Products</Link>
                    <Link href="/why-us" className="hover:text-black/70">Why Us</Link>
                    <Link href="/faq" className="hover:text-black/70">FAQ</Link>
                    <Link href="/contact" className="hover:text-black/70">Contact</Link>
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 text-sm md:flex">
                    <button onClick={() => openAuth("login")} className="btn-ghost">Login</button>
                    <button onClick={() => openAuth("register")} className="btn-gold">Register</button>
                    {/* <Link href="/cart" className="relative rounded-xl border border-neutral-300 px-4 py-2 font-medium hover:bg-neutral-100">
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-[#c89f48] px-1.5 text-center text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link> */}
                </div>

                {/* Hamburger (mobile) */}
                <button
                    aria-label="Open menu"
                    aria-controls="mobile-menu"
                    aria-expanded={open}
                    onClick={() => setOpen(true)}
                    className="md:hidden rounded-lg border border-neutral-300 p-2"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div
                    id="mobile-menu"
                    className="fixed inset-0 z-50 md:hidden"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Panel */}
                    <div
                        className="absolute left-0 top-0 h-dvh w-80 max-w-[85%] bg-white shadow-xl overflow-y-auto pb-safe"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="relative h-10 w-24">
                                    <Image src="/transparent-gold-logo.png" alt="dusbullion logo" fill className="object-contain" />
                                </div>
                                {/* <span className="text-lg font-semibold">dusbullion</span> */}
                            </Link>
                            <button
                                aria-label="Close menu"
                                onClick={() => setOpen(false)}
                                className="rounded-lg border border-neutral-300 p-2"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <nav className="px-2 py-2">
                            <Link href="/products" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-[15px] hover:bg-neutral-100">Products</Link>
                            <Link href="/why-us" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-[15px] hover:bg-neutral-100">Why Us</Link>
                            <Link href="/faq" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-[15px] hover:bg-neutral-100">FAQ</Link>
                            <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-[15px] hover:bg-neutral-100">Contact</Link>
                        </nav>

                        <div className="mt-2 space-y-2 px-2 pb-6">
                            <button onClick={() => { setOpen(false); openAuth("login"); }} className="btn-ghost w-full">Login</button>
                            <button onClick={() => { setOpen(false); openAuth("register"); }} className="btn-gold w-full">Register</button>
                            {/* <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="relative block w-full rounded-xl border border-neutral-300 px-4 py-2 text-center font-medium hover:bg-neutral-100"
              >
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#c89f48] px-1.5 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link> */}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
