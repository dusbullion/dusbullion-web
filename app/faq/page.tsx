export const metadata = {
  title: "FAQ | dusbullion.com",
  description: "Frequently Asked Questions about gold buying, shipping, and purity.",
};

import FAQList from "../components/FAQList";

export default function FAQPage() {
  return (
    <section className="space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Everything you need to know about buying and selling precious metals with dusbullion.com.
        </p>
      </header>

      <FAQList />
    </section>
  );
}
