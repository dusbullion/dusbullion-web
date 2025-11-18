// app/shipping-returns/page.tsx
export const metadata = {
  title: "Shipping & Returns | Dus Bullion",
  description: "Information about shipping, delivery timelines, order insurance, and return policies.",
};

export default function ShippingReturnsPage() {
  return (
    <section className="section py-10 max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Shipping & Returns</h1>

      <h2 className="text-xl font-semibold">Shipping</h2>
      <p className="text-neutral-700 leading-relaxed">
        All orders are shipped fully insured using trusted carriers such as UPS 
        and FedEx. Orders typically ship within 1–2 business days after payment 
        is cleared.
      </p>

      <ul className="list-disc pl-6 space-y-2 text-neutral-700">
        <li>Free insured shipping on eligible orders</li>
        <li>Tracking number provided once shipped</li>
        <li>Signature confirmation required for delivery</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Returns Policy</h2>
      <p className="text-neutral-700 leading-relaxed">
        Precious metals sales are final due to market volatility. However, if your 
        order arrives damaged or incorrect, contact us within 48 hours and we will 
        make it right.
      </p>

      <ul className="list-disc pl-6 space-y-2 text-neutral-700">
        <li>Report damaged shipments within 48 hours</li>
        <li>Include photos for faster resolution</li>
        <li>We will issue replacements or refunds where applicable</li>
      </ul>
    </section>
  );
}
