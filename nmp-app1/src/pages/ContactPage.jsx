import { useState } from "react";
import { contactInfo } from "../data/demoData";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real API call
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div
      className="bg-[#f8f9fa] text-[#191c1d] min-h-screen"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Hero */}
      <section
        className="pt-16 md:pt-24 pb-12 md:pb-16 px-4 md:px-12"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(223,236,96,0.15), transparent), radial-gradient(circle at bottom left, rgba(0,52,43,0.05), transparent)",
        }}
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#00342b] mb-4">Contact Us</h1>
          <p className="text-base md:text-lg text-[#3f4945] max-w-2xl mx-auto px-2">
            Have questions or need assistance? We are here to help you connect with the right healthcare professionals
            who understand your needs.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00342b] mb-8">Send us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#3f4945]">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#bfc9c4] bg-white focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] transition-all outline-none text-base min-h-[48px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#3f4945]">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#bfc9c4] bg-white focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] transition-all outline-none text-base min-h-[48px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium text-[#3f4945]">Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  placeholder="What is this regarding?"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#bfc9c4] bg-white focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] transition-all outline-none text-base min-h-[48px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-[#3f4945]">Your Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#bfc9c4] bg-white focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] transition-all outline-none text-base resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-[#00342b] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#004d40] transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 min-h-[56px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
                Send Message
              </button>
            </form>
          </div>

          {/* Right column: info + map */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-8">
            {/* Info Card */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-[#edeeef]">
              <h3 className="text-xl font-semibold text-[#00342b] mb-6">Contact Information</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    ),
                    label: "Address",
                    value: contactInfo.address,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    ),
                    label: "Phone",
                    value: contactInfo.phone,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    ),
                    label: "Email",
                    value: contactInfo.email,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    ),
                    label: "Hours",
                    value: contactInfo.hours,
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 py-3 border-b border-[#e1e3e4] last:border-0">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-[#dfec60] text-[#5b6300]">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#3f4945]">{label}</p>
                      <p className="text-base text-[#191c1d]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mt-6 flex gap-3">
                {[
                  { label: "Facebook", href: "#", color: "text-blue-700", icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
                  { label: "Instagram", href: "#", color: "text-pink-600", icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg> },
                  { label: "WhatsApp", href: "#", color: "text-green-500", icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.05 4.91c-2.15-2.15-5.02-3.34-8.07-3.34C4.99 1.57.11 6.45.11 12.44c0 1.92.49 3.78 1.44 5.44L0 23.93l6.23-1.63c1.58.86 3.37 1.32 5.18 1.32 6.01 0 10.89-4.88 10.89-10.87 0-2.91-1.13-5.64-3.25-7.84z" /></svg> },
                ].map(({ label, href, color, icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`w-11 h-11 flex items-center justify-center rounded-full bg-[#edeeef] hover:bg-[#00342b] hover:text-white transition-all duration-300 ${color}`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden border border-[#edeeef]">
              <div className="h-64 bg-gradient-to-br from-teal-50 to-green-50 flex flex-col items-center justify-center gap-3 text-[#00342b]">
                <svg className="w-12 h-12 text-[#00342b]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                </svg>
                <p className="font-medium text-[#3f4945]">Map will load here</p>
                <p className="text-sm text-[#3f4945]/60 text-center px-4">
                  Integrate Google Maps or similar once API is available
                </p>
              </div>
              <div className="p-4 border-t border-[#edeeef]">
                <p className="text-sm font-medium text-[#191c1d]">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
