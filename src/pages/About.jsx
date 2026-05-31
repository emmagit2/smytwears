import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem, Shield, Users } from 'lucide-react';
import { IMAGES } from '@/data/images';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src={IMAGES.hero} alt="SMYT About" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-medium">Our Story</span>
            <h1 className="text-4xl sm:text-6xl font-black text-white mt-4 tracking-tighter">
              Self Made You Today
            </h1>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            SMYT was born from a simple truth: everything worth having is built, never given. We started 
            in Lagos with a vision to create premium streetwear that speaks to the heart of every young 
            Nigerian grinding to make something of themselves.
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mt-6">
            Our clothes aren't just fabric — they're armour for ambition. Every stitch, every design, 
            every drop is a reminder that you are the architect of your own success. We don't follow 
            trends. We build movements.
          </p>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="bg-secondary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square overflow-hidden">
              <img src={IMAGES.founder} alt="Founder" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
                Founder's Note
              </span>
              <p className="mt-6 text-muted-foreground leading-relaxed italic">
                "I started SMYT because I was tired of seeing Nigerian talent go unrecognised. I wanted 
                to create a brand that doesn't just dress you — it reminds you of who you are every time 
                you look in the mirror. You are self-made. You are built different. And this brand exists 
                because of people like you."
              </p>
              <div className="mt-8">
                <p className="font-bold text-sm">— The Founder</p>
                <p className="text-xs text-muted-foreground">SMYT, Lagos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Gem,
                title: 'Authenticity',
                desc: 'We keep it real. Every design is genuine, every message is from the heart. No fronting, no copying — just original SMYT.'
              },
              {
                icon: Shield,
                title: 'Quality',
                desc: 'We obsess over every detail. Premium fabrics, precise stitching, and designs that last. If it doesn\'t meet our standard, it doesn\'t ship.'
              },
              {
                icon: Users,
                title: 'Community',
                desc: 'SMYT is bigger than clothing. We\'re building a community of builders, dreamers, and doers across Nigeria and beyond.'
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-border p-8 text-center">
                <div className="w-14 h-14 border-2 border-foreground flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm uppercase tracking-[0.15em] font-bold">{title}</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to build yourself?</h2>
        <p className="mt-4 text-background/60 text-sm max-w-md mx-auto">
          Join thousands of Nigerians who wear their ambition. Your journey starts with what you put on.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-background text-foreground px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-background/90 transition-colors"
        >
          Shop Now <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}