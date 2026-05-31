import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { IMAGES } from '@/data/images';

const craftNodes = [
  {
    type: 'image',
    src: IMAGES.menCollection,
    label: 'Design',
    angle: -135,
    desc: 'Every piece starts as a concept — bold, intentional, purposeful.',
  },
  {
    type: 'image',
    src: IMAGES.womenCollection,
    label: 'Fabric',
    angle: -45,
    desc: 'We source only premium heavyweight fabrics built to outlast trends.',
  },
  {
    type: 'video',
    src: 'https://videos.pexels.com/video-files/4065387/4065387-sd_640_360_30fps.mp4',
    label: 'Craft',
    angle: 45,
    desc: 'Stitched with precision. Every seam tells a story of mastery.',
  },
  {
    type: 'image',
    src: IMAGES.accessoriesCollection,
    label: 'Finish',
    angle: 135,
    desc: 'Quality-checked before it ever reaches your hands.',
  },
];

const RADIUS = 220; // desktop orbit radius

function polarToXY(angleDeg, r) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(rad) * r,
    y: Math.sin(rad) * r,
  };
}

function CraftNode({ node, index }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const { x, y } = polarToXY(node.angle, RADIUS);

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: 160,
      }}
    >
      {/* Connector line */}
      <svg
        className="absolute pointer-events-none"
        style={{
          width: Math.abs(x) * 2 + 10,
          height: Math.abs(y) * 2 + 10,
          left: x < 0 ? `${x}px` : `-${Math.abs(x)}px`,
          top: y < 0 ? `${y}px` : `-${Math.abs(y)}px`,
          zIndex: 0,
        }}
      />

      {/* Circle */}
      <div
        className="relative overflow-hidden rounded-full border-2 shadow-xl group cursor-pointer"
        style={{
          width: 140,
          height: 140,
          borderColor: '#8e2424',
          boxShadow: '0 0 0 4px rgba(142,36,36,0.12)',
        }}
        onClick={node.type === 'video' ? toggleVideo : undefined}
      >
        {node.type === 'video' ? (
          <>
            <video
              ref={videoRef}
              src={node.src}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:opacity-100">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: '#8e2424' }}
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </div>
            </div>
          </>
        ) : (
          <img
            src={node.src}
            alt={node.label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {/* Index badge */}
        <div
          className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black"
          style={{ backgroundColor: '#8e2424' }}
        >
          {index + 1}
        </div>
      </div>

      {/* Label */}
      <p className="mt-3 text-xs uppercase tracking-[0.2em] font-bold text-gray-900 text-center">
        {node.label}
      </p>
      {node.type === 'video' && (
        <span
          className="text-[9px] uppercase tracking-wider font-semibold mt-0.5"
          style={{ color: '#8e2424' }}
        >
          ▶ Play video
        </span>
      )}
    </div>
  );
}

export default function OurCraft() {
  return (
    <section className="py-24 sm:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5" style={{ backgroundColor: '#8e2424' }} />
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">
              Behind the Brand
            </span>
            <div className="w-8 h-0.5" style={{ backgroundColor: '#8e2424' }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
            How We Build
          </h2>
        </div>

        {/* ─── DESKTOP: Orbital Layout ─── */}
        <div className="hidden lg:block relative" style={{ height: 600 }}>
          {/* Orbit ring */}
          <div
            className="absolute rounded-full border border-dashed"
            style={{
              width: RADIUS * 2 + 160,
              height: RADIUS * 2 + 160,
              borderColor: 'rgba(142,36,36,0.15)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Center text */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 px-4" style={{ width: 220 }}>
            <div
              className="w-32 h-32 rounded-full flex flex-col items-center justify-center mx-auto mb-4 border-2"
              style={{
                backgroundColor: '#8e2424',
                borderColor: '#8e2424',
              }}
            >
              <span className="text-white font-black text-2xl leading-none">SMYT</span>
              <span className="text-white/70 text-[9px] uppercase tracking-[0.2em] mt-1">Craft</span>
            </div>
            <h3 className="text-base font-black text-gray-900 tracking-tight">Our Process</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              From sketch to stitch — every step done with intention.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1 mt-3 text-xs font-bold uppercase tracking-wider"
              style={{ color: '#8e2424' }}
            >
              Our Story <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Orbital nodes */}
          {craftNodes.map((node, i) => (
            <CraftNode key={node.label} node={node} index={i} />
          ))}
        </div>

        {/* ─── MOBILE: Vertical funnel ─── */}
        <div className="lg:hidden">
          {/* Center badge */}
          <div className="flex justify-center mb-10">
            <div
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-white"
              style={{ backgroundColor: '#8e2424' }}
            >
              <span className="font-black text-xl leading-none">SMYT</span>
              <span className="text-white/70 text-[9px] uppercase tracking-wider mt-0.5">Craft</span>
            </div>
          </div>

          <div className="relative space-y-0">
            {craftNodes.map((node, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={node.label}
                  className={`flex items-center gap-6 py-6 border-t border-gray-50 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Circle */}
                  <div
                    className="relative overflow-hidden rounded-full flex-shrink-0 border-2"
                    style={{
                      width: 110,
                      height: 110,
                      borderColor: '#8e2424',
                    }}
                  >
                    {node.type === 'video' ? (
                      <video
                        src={node.src}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={node.src}
                        alt={node.label}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div
                      className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black"
                      style={{ backgroundColor: '#8e2424' }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* Text */}
                  <div className={isLeft ? 'text-left' : 'text-right'}>
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-900 mb-1">
                      {node.label}
                      {node.type === 'video' && (
                        <span className="ml-2 text-[9px]" style={{ color: '#8e2424' }}>▶ Video</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-[180px]">{node.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white px-8 py-3"
              style={{ backgroundColor: '#8e2424' }}
            >
              Our Full Story <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ─── Step descriptions (desktop) ─── */}
        <div className="hidden lg:grid grid-cols-4 gap-6 mt-8 border-t border-gray-100 pt-8">
          {craftNodes.map((node, i) => (
            <div key={node.label} className="text-center px-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span
                  className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                  style={{ backgroundColor: '#8e2424' }}
                >
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