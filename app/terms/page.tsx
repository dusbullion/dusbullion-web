// app/terms/page.tsx
export const metadata = {
  title: "Terms & Conditions | Dus Bullion",
  description: "Terms and conditions for using Dus Bullion services.",
};

export default function TermsPage() {
  return (
    <section className="section py-10 max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Terms & Conditions</h1>

      <p className="text-neutral-700 leading-relaxed">
        By using dusbullion.com, you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6">Use of Website</h2>
      <p className="text-neutral-700 leading-relaxed">
        You may browse products and place orders for personal use only.
      </p>

      <h2 className="text-xl font-semibold mt-6">Pricing & Product Availability</h2>
      <p className="text-neutral-700 leading-relaxed">
        All prices fluctuate with the live precious metals market. Orders are 
        locked at the moment of checkout.
      </p>

      <h2 className="text-xl font-semibold mt-6">Limitation of Liability</h2>
      <p className="text-neutral-700 leading-relaxed">
        We are not responsible for market changes, pricing errors, or delays caused 
        by carriers.
      </p>
    </section>
  );
}
