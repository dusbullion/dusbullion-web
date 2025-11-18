// app/payment-methods/page.tsx
export const metadata = {
  title: "Payment Methods | Dus Bullion",
  description: "Accepted payment methods including cards, ACH, wire transfers, and digital wallets.",
};

export default function PaymentMethodsPage() {
  return (
    <section className="section py-10 max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Payment Methods</h1>

      <p className="text-neutral-700 leading-relaxed">
        We offer multiple secure payment options to make your purchase fast and easy.
      </p>

      <h2 className="text-xl font-semibold mt-4">Accepted Payments</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-700">
        <li>Credit & Debit Cards (Visa, Mastercard, Amex)</li>
        <li>Apple Pay</li>
        <li>Google Pay</li>
        <li>ACH / Bank Transfer</li>
        <li>Wire Transfer</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Secure Checkout</h2>
      <p className="text-neutral-700 leading-relaxed">
        All payments are processed through secure, PCI-compliant gateways. Your 
        financial data is encrypted and never stored on our servers.
      </p>
    </section>
  );
}
