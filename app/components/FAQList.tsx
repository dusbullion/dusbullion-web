"use client";
import { useState } from "react";

const faqs = [
  { q: "Is your gold authentic?",
    a: "Yes. We deal only in LBMA-accredited brands like PAMP, RCM, and Perth Mint. Every item includes a certificate of authenticity and serial number." },
  { q: "Do you ship internationally?",
    a: "Currently, we deliver only within India and the United States, with insured and trackable delivery partners. More regions coming soon." },
  { q: "How is live price calculated?",
    a: "Prices are based on real-time international spot rates for XAU (Gold) and XAG (Silver), updated every 15 seconds, plus a transparent premium." },
  { q: "Can I sell my gold back to dusbullion.com?",
    a: "Yes! You can sell back your bullion to us at live spot minus a minimal spread. Contact us for instant buyback assistance." },
  { q: "What payment methods do you accept?",
    a: "We accept all major credit cards, UPI, and direct bank transfers for high-value orders. Payments are fully encrypted and verified." },
];

export default function FAQList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
      {faqs.map((f, i) => (
        <div key={i} className="p-4">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between text-left text-base font-medium"
          >
            {f.q}
            <span className="text-xl">{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && <p className="mt-2 text-sm text-neutral-600">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
