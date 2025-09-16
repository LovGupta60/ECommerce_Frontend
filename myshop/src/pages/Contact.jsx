import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold">Contact Us</h2>
      <p className="text-sm text-gray-600 mt-1">Have a question? Send us a message.</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          placeholder="Your name"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          placeholder="Your email"
          type="email"
          required
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          value={form.message}
          onChange={e => setForm({...form, message: e.target.value})}
          placeholder="Message"
          rows="5"
          required
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded">Send</button>
          {sent && <div className="text-sm text-green-600">Message sent (demo)</div>}
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        <div><strong>Phone:</strong> +91-XXXXXXXXXX</div>
        <div><strong>Address:</strong> 123 Market Rd, Your City</div>
      </div>
    </div>
  );
}
