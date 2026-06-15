import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGES } from '@/data/images';

const craftNodes = [
  {
    type: 'image',
    src: IMAGES.design,       // ← your new image
    label: 'Design',
    angle: -135,
    desc: 'Every piece starts as a concept — bold, intentional, purposeful.',
  },
  {
    type: 'image',
    src: IMAGES.fabric,       // ← your new image
    label: 'Fabric',
    angle: -45,
    desc: 'We source only premium heavyweight fabrics built to outlast trends.',
  },
  {
    type: 'video',
    youtubeId: 'NZZbCk0Fas4',
    thumbnail: 'https://img.youtube.com/vi/NZZbCk0Fas4/hqdefault.jpg',
    label: 'Craft',
    angle: 45,
    desc: 'Stitched with precision. Every seam tells a story of mastery.',
  },
  {
    type: 'image',
    src: IMAGES.finish,       // ← your new image
    label: 'Finish',
    angle: 135,
    desc: 'Quality-checked before it ever reaches your hands.',
  },
];

const RADIUS = 220;
const BRAND  = '#8e2424';

function polarToXY(angleDeg, r) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

/* ─── Scroll-into-view hook ─────────────────────────────────── */
function useScrollReveal(ref, threshold = 0.25) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* ─── Animated SVG orbit layer ─────────────────────────────── */
function OrbitSVG({ size }) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = RADIUS;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <path
          id="orbitPath"
          d={`M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx + r - 0.001} ${cy}`}
          fill="none"
        />
        {craftNodes.map((node, i) => {
          const { x, y } = polarToXY(node.angle, r);
          return (
            <path
              key={i}
              id={`spoke-${i}`}
              d={`M ${cx} ${cy} L ${cx + x} ${cy + y}`}
              fill="none"
            />
          );
        })}
      </defs>

      {/* Orbit ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={BRAND} strokeWidth="0.8" strokeDasharray="4 8" opacity="0.2" />

      {/* Spoke lines */}
      {craftNodes.map((node, i) => {
        const { x, y } = polarToXY(node.angle, r);
        return (
          <line key={i} x1={cx} y1={cy} x2={cx + x} y2={cy + y}
            stroke={BRAND} strokeWidth="0.8" strokeDasharray="4 6" opacity="0.25"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-100"
              dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
          </line>
        );
      })}

      {/* Orbit travelling dots */}
      {craftNodes.map((_, i) => (
        <circle key={`orbit-dot-${i}`} r="3.5" fill={BRAND} filter="url(#glow)" opacity="0.85">
          <animateMotion dur="8s" repeatCount="indefinite" begin={`${-i * 2}s`}>
            <mpath href="#orbitPath" />
          </animateMotion>
        </circle>
      ))}

      {/* Spoke travelling dots */}
      {craftNodes.map((_, i) => (
        <circle key={`spoke-dot-${i}`} r="2.5" fill={BRAND} filter="url(#glow)" opacity="0.7">
          <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${-i * 0.8}s`}>
            <mpath href={`#spoke-${i}`} />
          </animateMotion>
        </circle>
      ))}

      {/* Center pulse rings */}
      {[0, 1].map(offset => (
        <circle key={offset} cx={cx} cy={cy} r="68" fill="none" stroke={BRAND} strokeWidth="1" opacity="0">
          <animate attributeName="r"       from="64" to="90" dur="2.5s" begin={`${offset * 1.25}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.3" to="0" dur="2.5s" begin={`${offset * 1.25}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Node pulse dots */}
      {craftNodes.map((node, i) => {
        const { x, y } = polarToXY(node.angle, r);
        return (
          <g key={`node-dot-${i}`}>
            <circle cx={cx + x} cy={cy + y} r="6" fill={BRAND} opacity="0">
              <animate attributeName="r"       from="8" to="20" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.25" to="0" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={cx + x} cy={cy + y} r="4" fill={BRAND} opacity="0.5" filter="url(#glow)" />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────── */
function Lightbox({ node, allNodes, onClose }) {
  const imageNodes    = allNodes.filter(n => n.type === 'image');
  const currentIndex  = imageNodes.findIndex(n => n.src === node.src);
  const [idx, setIdx] = useState(currentIndex >= 0 ? currentIndex : 0);
  const current       = node.type === 'video' ? node : imageNodes[idx];
  const canNav        = node.type === 'image' && imageNodes.length > 1;
  const prev = () => setIdx(i => (i - 1 + imageNodes.length) % imageNodes.length);
  const next = () => setIdx(i => (i + 1) % imageNodes.length);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ animation: 'fadeIn .2s ease both' }}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition z-10">
        <X className="w-5 h-5" />
      </button>
      {canNav && (
        <>
          <button onClick={prev} className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition z-10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition z-10">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      <div className="relative max-w-4xl w-full mx-6">
        {current.type === 'video' ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0`}
              title="Craft video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <img
            src={imageNodes[idx]?.src || current.src}
            alt={imageNodes[idx]?.label || current.label}
            className="w-full max-h-[80vh] object-contain rounded-lg"
          />
        )}
        <p className="text-center text-white/60 text-xs uppercase tracking-widest mt-4 font-semibold">
          {current.label}{canNav && ` — ${idx + 1} / ${imageNodes.length}`}
        </p>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
    </div>
  );
}

/* ─── CraftNode — slides in from left/right on scroll ───────── */
function CraftNode({ node, index, onOpen, visible }) {
  const { x, y }  = polarToXY(node.angle, RADIUS);
  const thumbnail = node.type === 'video' ? node.thumbnail : node.src;

  // Left side nodes (angle < 0 on x axis) slide from left, right side from right
  const fromLeft  = x < 0;
  const delay     = index * 120; // stagger each node

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer"
      style={{
        left: `calc(50% + ${x}px)`,
        top:  `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: 160,
        zIndex: 10,
        // Scroll reveal: slide in from left or right
        opacity:    visible ? 1 : 0,
        translate:  visible ? '0px' : `${fromLeft ? '-80px' : '80px'}`,
        transition: `opacity 0.6s ease ${delay}ms, translate 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
      }}
      onClick={() => onOpen(node)}
    >
      {/* Circle with rotate-on-hover + continuous slow spin */}
      <div
        style={{
          width: 140, height: 140,
          position: 'relative',
          borderRadius: '50%',
        }}
      >
        {/* Spinning border ring */}
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: `2px dashed ${BRAND}`,
            opacity: 0.35,
            animation: `spinRing ${8 + index * 2}s linear infinite`,
            animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
          }}
        />

        {/* Second inner spinning ring (counter) */}
        <div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: '50%',
            border: `1px solid ${BRAND}`,
            opacity: 0.15,
            animation: `spinRing ${5 + index}s linear infinite`,
            animationDirection: index % 2 === 0 ? 'reverse' : 'normal',
          }}
        />

        {/* Image circle */}
        <div
          className="group"
          style={{
            width: 140, height: 140,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2.5px solid ${BRAND}`,
            boxShadow: `0 0 0 4px rgba(142,36,36,0.1), 0 8px 32px rgba(0,0,0,0.12)`,
            position: 'relative',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = `0 0 0 6px rgba(142,36,36,0.2), 0 12px 40px rgba(0,0,0,0.18)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 0 0 4px rgba(142,36,36,0.1), 0 8px 32px rgba(0,0,0,0.12)`;
          }}
        >
          <img
            src={thumbnail}
            alt={node.label}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />

          {/* Hover overlay */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.3)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
          >
            {node.type === 'video' ? (
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play style={{ width: 16, height: 16, color: '#fff', marginLeft: 2 }} />
              </div>
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>⤢</div>
            )}
          </div>

          {/* Badge */}
          <div style={{
            position: 'absolute', top: 8, left: 8,
            width: 24, height: 24, borderRadius: '50%',
            backgroundColor: BRAND,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 10, fontWeight: 900,
          }}>
            {index + 1}
          </div>
        </div>
      </div>

      <p style={{ marginTop: 12, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: '#111', textAlign: 'center' }}>
        {node.label}
      </p>
      {node.type === 'video' && (
        <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: BRAND, marginTop: 2 }}>
          ▶ Watch video
        </span>
      )}
    </div>
  );
}

/* ─── OurCraft ───────────────────────────────────────────────── */
export default function OurCraft() {
  const [lightboxNode, setLightboxNode] = useState(null);
  const containerRef = useRef(null);
  const sectionRef   = useRef(null);
  const [svgSize, setSvgSize] = useState(600);
  const visible = useScrollReveal(sectionRef, 0.2);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      setSvgSize(entries[0].contentRect.width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-white overflow-hidden">

      {/* Keyframes injected once */}
      <style>{`
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {lightboxNode && (
        <Lightbox node={lightboxNode} allNodes={craftNodes} onClose={() => setLightboxNode(null)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header — fades up on scroll */}
        <div
          className="text-center mb-16"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5" style={{ backgroundColor: BRAND }} />
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">Behind the Brand</span>
            <div className="w-8 h-0.5" style={{ backgroundColor: BRAND }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">How We Build</h2>
        </div>

        {/* ─── DESKTOP ─── */}
        <div ref={containerRef} className="hidden lg:block relative" style={{ height: 600 }}>
          <OrbitSVG size={svgSize || 600} />

          {/* Center — scales in */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 px-4"
            style={{
              width: 220,
              opacity:    visible ? 1 : 0,
              transform:  visible ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0.6)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s',
            }}
          >
            <div
              style={{
                width: 128, height: 128, borderRadius: '50%',
                backgroundColor: BRAND, border: `2px solid ${BRAND}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                animation: visible ? 'spinRing 20s linear infinite' : 'none',
                boxShadow: `0 0 40px rgba(142,36,36,0.25)`,
              }}
            >
              {/* Inner content doesn't spin — counter-rotate */}
              <div style={{ animation: visible ? 'spinRing 20s linear infinite reverse' : 'none' }}>
                <span style={{ display: 'block', color: '#fff', fontWeight: 900, fontSize: 24, lineHeight: 1 }}>SMYT</span>
                <span style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 4 }}>Craft</span>
              </div>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#111', letterSpacing: '-0.01em' }}>Our Process</h3>
            <p style={{ fontSize: 11, color: '#aaa', marginTop: 4, lineHeight: 1.6 }}>
              From sketch to stitch — every step done with intention.
            </p>
            <Link
              to="/about"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: BRAND, textDecoration: 'none' }}
            >
              Our Story <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          {/* Nodes */}
          {craftNodes.map((node, i) => (
            <CraftNode key={node.label} node={node} index={i} onOpen={setLightboxNode} visible={visible} />
          ))}
        </div>

        {/* ─── MOBILE ─── */}
        <div className="lg:hidden">
          <div className="flex justify-center mb-10">
            <div
              style={{
                position: 'relative',
                opacity:    visible ? 1 : 0,
                transform:  visible ? 'scale(1)' : 'scale(0.5)',
                transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <div
                style={{
                  position: 'absolute', inset: -8,
                  borderRadius: '50%',
                  border: `2px dashed ${BRAND}`,
                  opacity: 0.3,
                  animation: 'spinRing 10s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute', inset: -16,
                  borderRadius: '50%',
                  border: `1px solid ${BRAND}`,
                  opacity: 0.15,
                  animation: 'spinRing 6s linear infinite reverse',
                }}
              />
              <div
                style={{
                  width: 96, height: 96, borderRadius: '50%',
                  backgroundColor: BRAND,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 32px rgba(142,36,36,0.3)`,
                }}
              >
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 20, lineHeight: 1 }}>SMYT</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>Craft</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              style={{
                position: 'absolute', left: 54, top: 0, bottom: 0, width: 1,
                backgroundImage: `repeating-linear-gradient(to bottom, ${BRAND} 0px, ${BRAND} 6px, transparent 6px, transparent 14px)`,
                opacity: 0.2,
              }}
            />

            {craftNodes.map((node, i) => {
              const thumbnail = node.type === 'video' ? node.thumbnail : node.src;
              const delay     = i * 150;
              return (
                <div
                  key={node.label}
                  style={{
                    position: 'relative',
                    display: 'flex', alignItems: 'center', gap: 24,
                    padding: '24px 0',
                    borderTop: '1px solid #f8f8f8',
                    cursor: 'pointer',
                    opacity:    visible ? 1 : 0,
                    transform:  visible ? 'translateX(0)' : 'translateX(-48px)',
                    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
                  }}
                  onClick={() => setLightboxNode(node)}
                >
                  {/* Travelling dot */}
                  <svg style={{ position: 'absolute', left: 46, top: 0, width: 18, height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
                    <circle r="3" fill={BRAND} opacity="0.8">
                      <animate attributeName="cy" from="0" to="100%" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${-i * 0.6}s`} />
                      <animate attributeName="opacity" from="0.8" to="0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${-i * 0.6}s`} />
                    </circle>
                  </svg>

                  {/* Circle with spinning rings */}
                  <div style={{ position: 'relative', flexShrink: 0, width: 110, height: 110 }}>
                    <div style={{
                      position: 'absolute', inset: -5, borderRadius: '50%',
                      border: `1.5px dashed ${BRAND}`, opacity: 0.3,
                      animation: `spinRing ${7 + i}s linear infinite`,
                      animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                    }} />
                    <div style={{
                      width: 110, height: 110, borderRadius: '50%',
                      overflow: 'hidden', border: `2px solid ${BRAND}`,
                      position: 'relative',
                      transition: 'transform 0.3s ease',
                    }}>
                      <img src={thumbnail} alt={node.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {node.type === 'video' && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play style={{ width: 24, height: 24, color: '#fff' }} />
                        </div>
                      )}
                      <div style={{
                        position: 'absolute', top: 6, left: 6,
                        width: 20, height: 20, borderRadius: '50%',
                        backgroundColor: BRAND, color: '#fff',
                        fontSize: 9, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {i + 1}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: '#111', marginBottom: 4 }}>
                      {node.label}
                      {node.type === 'video' && (
                        <span style={{ marginLeft: 8, fontSize: 9, color: BRAND }}>▶ Video</span>
                      )}
                    </p>
                    <p style={{ fontSize: 11, color: '#888', lineHeight: 1.6, maxWidth: 200 }}>{node.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              textAlign: 'center', marginTop: 40,
              opacity:    visible ? 1 : 0,
              transform:  visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.6s ease 600ms, transform 0.6s ease 600ms`,
            }}
          >
            <Link
              to="/about"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 32px',
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700,
                color: '#fff', backgroundColor: BRAND, textDecoration: 'none',
              }}
            >
              Our Full Story <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
        </div>

        {/* ─── Step descriptions (desktop) ─── */}
        <div
          className="hidden lg:grid grid-cols-4 gap-6 mt-8 border-t border-gray-100 pt-8"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s',
          }}
        >
          {craftNodes.map((node, i) => (
            <div key={node.label} className="text-center px-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: BRAND, color: '#fff', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </span>
                <p className="text-xs uppercase tracking-wider font-bold text-gray-900">{node.label}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{node.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}