import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Zap, Instagram } from 'lucide-react';
import { fetchBestSellers, fetchNewArrivals } from '@/data/products';
import { IMAGES } from '@/data/images';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import HeroCarousel from '../components/HeroCarousel';
import Testimonials from '../components/Testimonials';
import OurCraft from '../components/OurCraft';
import { useQuery } from '@tanstack/react-query';

const VISIBLE_COUNT = 4;
const INTERVAL_MS   = 4000;

export default function Home() {
  const [email, setEmail] = useState('');

  const { data: bestSellers = [], isLoading: loadingBest } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchBestSellers,
  });

  const { data: newArrivals = [], isLoading: loadingNew } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivals,
  });

  const [displayedNew, setDisplayedNew]   = useState([]);
  const [fadeStates, setFadeStates]       = useState(Array(VISIBLE_COUNT).fill(true));
  const rotationRef                       = useRef(0);

  useEffect(() => {
    if (newArrivals.length > 0) {
      setDisplayedNew(newArrivals.slice(0, VISIBLE_COUNT));
      rotationRef.current = Math.min(VISIBLE_COUNT, newArrivals.length) % newArrivals.length;
    }
  }, [newArrivals]);

  useEffect(() => {
    if (newArrivals.length <= VISIBLE_COUNT) return;
    const timer = setInterval(() => {
      const slotIndex   = Math.floor(Math.random() * VISIBLE_COUNT);
      const nextProduct = newArrivals[rotationRef.current];
      rotationRef.current = (rotationRef.current + 1) % newArrivals.length;

      setFadeStates(prev => {
        const next = [...prev];
        next[slotIndex] = false;
        return next;
      });

      setTimeout(() => {
        setDisplayedNew(prev => {
          const next = [...prev];
          next[slotIndex] = nextProduct;
          return next;
        });
        setFadeStates(prev => {
          const next = [...prev];
          next[slotIndex] = true;
          return next;
        });
      }, 400);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [newArrivals]);

  // Card grid columns based on actual count shown
  const count      = displayedNew.length || VISIBLE_COUNT;
const gridCols =
  count === 1 ? 'grid-cols-2 lg:grid-cols-4' :
  count === 2 ? 'grid-cols-2 lg:grid-cols-4' :
  count === 3 ? 'grid-cols-2 sm:grid-cols-3' :
                'grid-cols-2 lg:grid-cols-4';

  return (
    <div>
      <HeroCarousel />
      <OurCraft />

      {/* Brand Story */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[3/4] overflow-hidden">
              <img src={IMAGES.brandStory} alt="SMYT Brand Story" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">The Movement</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 tracking-tight">Self Made You Today</h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                SMYT isn't just a brand — it's a belief system. We exist for the ones who wake up every day
                and choose to build something from nothing. The ones who don't wait for permission, don't
                make excuses, and don't take shortcuts.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Every piece we create is a reminder that success is built, never given. Our clothes are
                for movers, builders, and dreamers across Nigeria who refuse to settle. When you wear SMYT,
                you wear your ambition.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-semibold border-b-2 border-foreground pb-1 hover:opacity-70 transition-opacity"
              >
                Our Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">Explore</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">Collections</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: 'Men',         image: IMAGES.menCollection,         path: '/shop?category=men' },
              { label: 'Women',       image: IMAGES.womenCollection,       path: '/shop?category=women' },
              { label: 'Accessories', image: IMAGES.accessoriesCollection, path: '/shop?category=accessories' },
            ].map(col => (
              <Link key={col.label} to={col.path} className="group relative aspect-[3/4] overflow-hidden">
                <img src={col.image} alt={col.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                  <h3 className="text-white text-2xl font-bold tracking-wider uppercase">{col.label}</h3>
                  <span className="text-white/70 text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">Most Popular</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">Best Sellers</h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-semibold hover:opacity-70 transition-opacity"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {loadingBest
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : bestSellers.map(product => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </div>
      </section>

      {/* ── New Arrivals — fixed 4, auto-rotates ── */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">Just Dropped</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight">New Arrivals</h2>
            </div>
            {newArrivals.length > VISIBLE_COUNT && (
              <Link
                to="/shop"
                className="hidden sm:flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-semibold hover:opacity-70 transition-opacity"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className={`grid gap-4 sm:gap-6 ${gridCols}`}>
            {loadingNew
              ? Array(VISIBLE_COUNT).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : displayedNew.map((product, i) => (
                  <div
                    key={product.id}
                    style={{
                      opacity:    fadeStates[i] ? 1 : 0,
                      transform:  fadeStates[i] ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'opacity 0.4s ease, transform 0.4s ease',
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Why SMYT */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
            {[
              { icon: Shield, title: 'Premium Quality',  desc: "Every piece is crafted from premium fabrics. We don't cut corners — we build to last." },
              { icon: Zap,    title: 'Made for Movers',  desc: 'Designed for those who are always on the go. Comfort meets style in every stitch.' },
              { icon: Truck,  title: 'Fast Delivery',    desc: 'Nationwide delivery across Nigeria. We bring premium, quality pieces straight to your door' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-14 h-14 border-2 border-foreground flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm uppercase tracking-[0.15em] font-bold">{title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
    {/*  <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Instagram className="w-6 h-6 mx-auto mb-4" />
          <h2 className="text-2xl font-bold tracking-tight">Follow us @selfmade.smyt</h2>
          <p className="text-muted-foreground text-sm mt-2 mb-10">Join the movement on Instagram</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[IMAGES.hero, IMAGES.brandStory, IMAGES.menCollection, IMAGES.womenCollection, IMAGES.accessoriesCollection, IMAGES.founder].map((img, i) => (
              <a key={i} href="https://www.instagram.com/selfmade.smyt" target="_blank" rel="noopener noreferrer" className="aspect-square overflow-hidden group">
                <img src={img} alt="SMYT on Instagram" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Affiliate Banner */}
      <section className="py-16 sm:py-20 overflow-hidden relative" style={{ backgroundColor: '#8e2424' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border-[40px] border-white" />
          <div className="absolute -left-10 -bottom-20 w-64 h-64 rounded-full border-[30px] border-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-semibold">Partner Programme</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">Earn With SMYT</h2>
            <p className="text-white/70 text-sm mt-2 max-w-md">
              Share our brand. Get paid 10% commission on every order you refer. Join 100+ ambassadors earning with SMYT.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/affiliate" className="px-8 py-4 bg-white text-xs uppercase tracking-widest font-black transition-opacity hover:opacity-90" style={{ color: '#8e2424' }}>
              Apply Now
            </Link>
            <Link to="/affiliate/dashboard" className="px-8 py-4 border border-white/40 text-white text-xs uppercase tracking-widest font-bold hover:bg-white/10 transition-colors">
              My Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="bg-foreground text-background py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Join the Movement</h2>
          <p className="mt-4 text-background/60 text-sm">
            Get early access to drops, exclusive deals, and brand updates. No spam — just the real stuff.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-background/20 px-4 py-3 text-sm placeholder:text-background/40 focus:outline-none focus:border-background/60"
            />
            <button className="bg-background text-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-background/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}