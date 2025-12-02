export const metadata = {
  title: "Contact | dusbullion.com",
  description: "Reach out to dusbullion.com for support, business, or bulk orders.",
};

import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <section className="space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Get in Touch</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          We’re here to answer your questions about gold, silver, or your order. Reach out anytime.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <ContactForm />
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          {/* <h3 className="text-lg font-semibold">Our Office</h3>
          <p className="text-sm text-neutral-600">
            2057 Belhaven Ave, Simi Valley, CA-93063 <br /> United States
          </p> */}

          <h3 className="text-lg font-semibold mt-4">Contact</h3>
          <p className="text-sm text-neutral-600">
            Email: <a href="mailto:bulliontrdr@gmail.com" className="text-blue-600 underline">bulliontrdr@gmail.com</a><br />
            Phone: +1 (805) 336-4805
          </p>

          <h3 className="text-lg font-semibold mt-4">Business Hours</h3>
          <p className="text-sm text-neutral-600">
            Mon–Fri: 9:00 AM – 6:00 PM<br />
            Sat: 10:00 AM – 4:00 PM<br />
            Sun: Closed
          </p>
        </div>
      </div>
    </section>
  );
}
