export const metadata = {
  title: "Why Us | dusbullion.com",
  description: "Why thousands trust dusbullion.com for authentic gold bullion and secure shipping.",
};

export default function WhyUsPage() {
  const highlights = [
    {
      title: "100% Authentic Gold & Silver",
      desc: "We source directly from accredited refiners like PAMP, RCM, and Perth Mint — every bar and coin is certified and traceable.",
      icon: "💎",
    },
    {
      title: "Transparent Pricing",
      desc: "Our prices update live with global market rates. No hidden spreads — you always pay the true metal value + a small transparent premium.",
      icon: "📈",
    },
    {
      title: "Insured Delivery",
      desc: "We partner with insured logistics providers to ensure every shipment reaches safely, securely, and discretely packed.",
      icon: "📦",
    },
    {
      title: "Buyback Guarantee",
      desc: "We offer instant buyback options for your bullion at market rates — making liquidity and trust a core part of our service.",
      icon: "🔒",
    },
  ];

  return (
    <section className="space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Why Choose dusbullion.com</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Trusted by investors and collectors worldwide — our mission is to make precious metal investing simple, transparent, and secure.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {highlights.map((h) => (
          <div
            key={h.title}
            className="rounded-2xl border border-neutral-200 bg-white p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-4xl">{h.icon}</div>
            <h3 className="mt-3 text-lg font-semibold">{h.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{h.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a href="/products" className="btn-primary text-base">
          Start Buying Gold
        </a>
      </div>
    </section>
  );
}
