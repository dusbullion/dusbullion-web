// app/about/page.tsx
export const metadata = {
  title: "About Us | Dus Bullion",
  description: "Learn about Dus Bullion, our mission, values, and commitment to transparent bullion pricing.",
};

export default function AboutPage() {
  return (
    <section className="section py-10 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-semibold">About Dus Bullion</h1>

      <p className="text-neutral-700 leading-relaxed">
        Dus Bullion was created with a simple mission — to make precious metals 
        investing transparent, accessible, and trustworthy. Our team brings years 
        of experience in bullion sourcing, risk management, and secure logistics.
      </p>

      <p className="text-neutral-700 leading-relaxed">
        We partner only with globally recognized mints and refiners, ensuring every 
        bar and coin meets the highest purity and authenticity standards.
      </p>

      <p className="text-neutral-700 leading-relaxed">
        With real-time spot pricing, secure checkout, insured shipping, and 
        customer-first service, we aim to simplify your bullion buying experience.
      </p>

      <h2 className="text-xl font-semibold mt-6">Our Values</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-700">
        <li>Transparency in pricing</li>
        <li>Authentic products from trusted mints</li>
        <li>Fast and insured delivery</li>
        <li>Secure online checkout</li>
        <li>Honest customer support</li>
      </ul>
    </section>
  );
}
