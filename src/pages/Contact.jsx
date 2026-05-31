import React, { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">Contact Us</h1>
        <p className="mt-4 text-muted-foreground text-sm max-w-md mx-auto">
          Have a question, suggestion, or just want to say what's up? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          {submitted ? (
            <div className="border border-border p-12 text-center">
              <h2 className="text-xl font-bold">Message Sent</h2>
              <p className="text-muted-foreground text-sm mt-2">
                We'll get back to you as soon as possible. Thank you for reaching out.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-6 text-sm underline font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Name</label>
                <input
                  name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Email</label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Subject</label>
                <select
                  name="subject" value={form.subject} onChange={handleChange} required
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground bg-background"
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Enquiry</option>
                  <option value="product">Product Question</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required rows={5}
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-foreground text-background px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm uppercase tracking-[0.15em] font-bold mb-4">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a href="tel:07054527285" className="text-sm text-muted-foreground hover:text-foreground">
                    07054527285
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href="mailto:selfmadeyoutoday@gmail.com" className="text-sm text-muted-foreground hover:text-foreground">
                    selfmadeyoutoday@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.15em] font-bold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/selfmade.smyt"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a
                href="https://wa.me/2347054527285"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="border border-border p-6 bg-secondary">
            <h3 className="text-sm font-bold mb-2">Business Hours</h3>
            <p className="text-sm text-muted-foreground">Monday – Friday: 9:00 AM – 6:00 PM</p>
            <p className="text-sm text-muted-foreground">Saturday: 10:00 AM – 4:00 PM</p>
            <p className="text-sm text-muted-foreground">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}