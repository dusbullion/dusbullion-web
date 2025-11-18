// app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy | Dus Bullion",
  description: "How Dus Bullion collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <section className="section py-10 max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>

      <p className="text-neutral-700 leading-relaxed">
        We respect your privacy. This policy explains how we collect and protect 
        your information.
      </p>

      <h2 className="text-xl font-semibold mt-4">Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-700">
        <li>Account information</li>
        <li>Order details</li>
        <li>Shipping and billing data</li>
        <li>Analytics for improving user experience</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">How We Use Your Information</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-700">
        <li>Process orders</li>
        <li>Provide customer support</li>
        <li>Improve website performance</li>
        <li>Prevent fraud</li>
      </ul>
    </section>
  );
}
