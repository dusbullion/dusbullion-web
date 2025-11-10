"use client";
import Image from "next/image";
import Link from "next/link";
import TopBar from "./TopBar";
import { useUI } from "../store/ui";

export default function Header() {
    const { openAuth } = useUI();

    return (
        <header className="sticky top-0 z-40 border-b border-neutral-200 glass">
            <TopBar />
            <div className="section flex items-center justify-between py-3">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-12 w-24 md:h-12 md:w-36">
                        <Image
                        src="/transparent-gold-logo.png"
                        alt="dusbullion logo - Gold Bars Bullion"
                        fill
                        className="object-contain"
                        priority
                        />
                    </div>

                    {/* <span className="text-lg font-semibold tracking-tight">dusbullion.com</span> */}
                </Link>
                <nav className="hidden items-center gap-6 text-sm md:flex">
                    <Link href="/products" className="hover:text-black/70">Products</Link>
                    <Link href="/why-us" className="hover:text-black/70">Why Us</Link>
                    <Link href="/faq" className="hover:text-black/70">FAQ</Link>
                    <Link href="/contact" className="hover:text-black/70">Contact</Link>
                </nav>
                <div className="flex items-center gap-3 text-sm">
                    <button onClick={() => openAuth("login")} className="btn-ghost hidden sm:inline">Login</button>
                    <button onClick={() => openAuth("register")} className="btn-gold">Register</button>
                </div>
            </div>
        </header>
    );
}