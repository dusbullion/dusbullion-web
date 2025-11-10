"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate email or Firestore here
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="space-y-1">
        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2"
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Message</label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2"
          rows={4}
          placeholder="Your message..."
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        {sent ? "Message Sent ✅" : "Send Message"}
      </button>
    </form>
  );
}
