// app/cookies/page.tsx
export const metadata = {
  title: "Cookie Policy | Dus Bullion",
  description: "Details about cookie usage on Dus Bullion.",
};

export default function CookiesPage() {
  return (
    <section className="section py-10 max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Cookie Policy</h1>

      <p className="text-neutral-700 leading-relaxed">
        We use cookies to improve your browsing experience and personalize content.
      </p>

      <h2 className="text-xl font-semibold mt-4">Types of Cookies We Use</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-700">
        <li>Essential cookies for core site functionality</li>
        <li>Analytics cookies to measure performance</li>
        <li>Preference cookies to save your settings</li>
      </ul>
    </section>
  );
}
