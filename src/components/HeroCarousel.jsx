import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { IMAGES } from '@/data/images';

const slides = [
  {
    image: IMAGES.hero,
    badge: 'New Collection',
    title: 'BUILT,\nNOT GIVEN.',
    subtitle: 'You build yourself daily. No shortcuts. No excuses. This is the uniform for those who create their own path.',
    cta: 'Shop Collection',
    ctaPath: '/shop',
    accent: true,
  },
  {
    image: IMAGES.menCollection,
    badge: "Men's Collection",
    title: 'MOVE\nDIFFERENT.',
    subtitle: 'Premium streetwear engineered for the man who refuses to settle. Every stitch built with intention.',
    cta: 'Shop Men',
    ctaPath: '/shop?category=men',
    accent: false,
  },
  {
    image: IMAGES.womenCollection,
    badge: "Women's Collection",
    title: 'QUEENS\nBUILD TOO.',
    subtitle: "For the woman who creates her own lane. Designed for those who don't wait for permission.",
    cta: 'Shop Women',
    ctaPath: '/shop?category=women',
    accent: true,
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[85vh] sm:h-[92vh] overflow-hidden bg-black">
      {/* Image */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      </div>

      {/* Brand color left slash */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: '#8e2424' }}
      />
      {/* Diagonal accent */}
      <div
        className="absolute top-0 left-0 h-full w-[6px] opacity-80"
        style={{ background: 'linear-gradient(180deg, #8e2424 0%, #cc3333 50%, #8e2424 100%)' }}
      />

      {/* Content */}
      <div className={`relative h-full flex items-center transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 w-full">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ backgroundColor: '#8e2424' }} />
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-white/70">
                {slide.badge}
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter whitespace-pre-line">
              {slide.title}
            </h1>

            {/* Red underline accent */}
            <div className="flex gap-2 mt-4 mb-6">
              <div className="h-1 w-16" style={{ backgroundColor: '#8e2424' }} />
              <div className="h-1 w-4 bg-white/30" />
            </div>

            <p className="text-white/70 text-base sm:text-lg max-w-md leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to={slide.ctaPath}
                className="inline-flex items-center gap-3 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#8e2424' }}
              >
                {slide.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="text-xs uppercase tracking-[0.2em] font-semibold text-white/60 hover:text-white border-b border-white/30 hover:border-white transition-colors pb-0.5"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide counter + nav */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300"
              >
                <div
                  className="h-0.5 transition-all duration-300"
                  style={{
                    width: i === current ? '32px' : '16px',
                    backgroundColor: i === current ? '#8e2424' : 'rgba(255,255,255,0.3)',
                  }}
                />
              </button>
            ))}
            <span className="text-white/40 text-xs ml-2 font-mono">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: '#8e2424' }}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}