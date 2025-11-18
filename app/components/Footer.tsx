import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-neutral-200 bg-white">
      <div className="section py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand + blurb */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-12 w-24 md:h-12 md:w-36">
                <Image
                  src="/dusbullion-logo.png"
                  alt="dusbullion logo - Gold Bars Bullion"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-sm text-neutral-600">
              Premium bullion at transparent prices. Insured shipping. Secure checkout.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/why-us" className="hover:text-black/70">
                  Why Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-black/70">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black/70">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/shipping-returns" className="hover:text-black/70">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="hover:text-black/70">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black/70">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-700">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/terms" className="hover:text-black/70">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black/70">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-black/70">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
          © {new Date().getFullYear()} dusbullion.com. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
