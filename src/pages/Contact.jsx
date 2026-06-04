import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="5%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="5" fill="url(#ig-grad)"/>
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#25D366"/>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.418A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.5a8.46 8.46 0 01-4.306-1.173l-.308-.184-3.197.91.925-3.093-.2-.317A8.46 8.46 0 013.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" fill="white"/>
  </svg>
);

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Name</label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground bg-background"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Email</label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange}
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground bg-background"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Subject</label>
                <select
                  name="subject" value={form.subject} onChange={handleChange}
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
                  name="message" value={form.message} onChange={handleChange} rows={5}
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none bg-background"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-foreground text-background px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors"
              >
                Send Message
              </button>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm uppercase tracking-[0.15em] font-bold mb-4">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a href="tel:07054527285" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    07054527285
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href="mailto:selfmadeyoutoday@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                <InstagramIcon /> Instagram
              </a>
              
                <a href="https://wa.me/2347054527285"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                <WhatsAppIcon /> WhatsApp
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