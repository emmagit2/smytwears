import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Minus, Plus, ChevronDown, ChevronUp, ArrowLeft,
  ZoomIn, X, ChevronLeft, ChevronRight,
  Heart, Share2, RotateCcw, Star
} from 'lucide-react';
import { fetchProductById, fetchRelatedProducts, formatPrice, getProductImage, getProductImages } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useQuery } from '@tanstack/react-query';
import { trackViewContent } from "@/lib/metaPixel";
import { PaystackLogo, VerveLogo, MastercardLogo } from '@/components/PaymentLogos';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

    :root {
      --brand:      #8e2424;
      --brand-lt:   #c05050;
      --ink:        #111010;
      --paper:      #f9f8f6;
      --card:       #ffffff;
      --muted:      #888077;
      --line:       #e6e1db;
      --hover:      #f2eeea;
      --tag-bg:     #fdf1f1;
    }

    /* page */
    .pdp { max-width:1180px; margin:0 auto; padding:14px 18px 80px; background:var(--paper); font-family:'Outfit',sans-serif; color:var(--ink); }

    /* top-bar */
    .top-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; }
    .back-btn { display:inline-flex; align-items:center; gap:4px; font-size:11.5px; color:var(--muted); background:none; border:none; cursor:pointer; padding:0; transition:color .2s; font-family:'Outfit',sans-serif; }
    .back-btn:hover { color:var(--ink); }
    .bc { display:flex; align-items:center; gap:4px; font-size:11px; color:var(--muted); font-family:'Outfit',sans-serif; letter-spacing:.02em; }
    .bc a { color:var(--muted); text-decoration:none; transition:color .2s; }
    .bc a:hover { color:var(--brand); }
    .bc-sep { opacity:.3; font-size:9px; }
    .bc-now { color:var(--ink); font-weight:500; max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .share-btn { display:inline-flex; align-items:center; gap:4px; font-size:11.5px; color:var(--muted); background:none; border:none; cursor:pointer; font-family:'Outfit',sans-serif; transition:color .2s; }
    .share-btn:hover { color:var(--ink); }

    /* grid */
    .pdp-grid { display:grid; grid-template-columns:1fr; gap:28px; }
    @media(min-width:860px){ .pdp-grid { grid-template-columns:360px 1fr; gap:44px; align-items:start; } }
    @media(min-width:1060px){ .pdp-grid { grid-template-columns:400px 1fr; } }

    /* ── GALLERY ── */
    .gallery { display:flex; flex-direction:column; gap:6px; }
    .main-frame {
      position:relative; aspect-ratio:3/4; overflow:hidden;
      background:#ede9e4; border:1px solid var(--line); cursor:zoom-in; border-radius:3px;
    }
    .main-frame img { width:100%; height:100%; object-fit:cover; transition:transform .55s cubic-bezier(.25,.46,.45,.94); display:block; }
    .main-frame:hover img { transform:scale(1.05); }
    .zoom-hint {
      position:absolute; bottom:10px; right:10px;
      background:rgba(255,255,255,.84); backdrop-filter:blur(6px);
      border:1px solid var(--line); border-radius:20px;
      padding:4px 10px; display:flex; align-items:center; gap:4px;
      font-size:9.5px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:var(--ink);
      opacity:0; transition:opacity .2s; pointer-events:none;
    }
    .main-frame:hover .zoom-hint { opacity:1; }
    .sale-tag {
      position:absolute; top:10px; left:10px; background:var(--brand); color:#fff;
      font-size:9px; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
      padding:3px 8px; border-radius:2px;
    }

    /* thumbs */
    .thumbs { display:flex; gap:5px; }
    .thumb { width:52px; height:58px; flex-shrink:0; overflow:hidden; border:2px solid transparent; cursor:pointer; transition:border-color .15s; border-radius:2px; background:#e8e4df; }
    .thumb img { width:100%; height:100%; object-fit:cover; transition:transform .25s; }
    .thumb:hover img { transform:scale(1.07); }
    .thumb.on { border-color:var(--ink); }

    /* ── INFO PANEL ── */
    .info { display:flex; flex-direction:column; }
    .brand-eyebrow { font-size:10px; font-weight:600; letter-spacing:.3em; text-transform:uppercase; color:var(--brand); }
    .prod-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,3vw,42px); font-weight:300; line-height:1.1; margin:6px 0 0; color:var(--ink); letter-spacing:-.01em; }
    .prod-title em { font-style:italic; font-weight:300; color:var(--brand-lt); }

    .rating-row { display:flex; align-items:center; gap:8px; margin-top:10px; }
    .stars { display:flex; gap:2px; }
    .s-fill { color:#d4900a; fill:#d4900a; width:13px; height:13px; }
    .s-mt   { color:#d4ccc4; width:13px; height:13px; }
    .r-count { font-size:12px; color:var(--muted); }
    .r-link  { font-size:12px; color:var(--brand); text-decoration:underline; cursor:pointer; background:none; border:none; font-family:'Outfit',sans-serif; }

    .price-row { display:flex; align-items:baseline; gap:10px; margin-top:16px; flex-wrap:wrap; }
    .p-now { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:var(--ink); line-height:1; }
    .p-was { font-size:16px; color:var(--muted); text-decoration:line-through; font-family:'Cormorant Garamond',serif; }
    .p-save { background:var(--tag-bg); color:var(--brand); font-size:10px; font-weight:600; letter-spacing:.06em; padding:3px 9px; border-radius:20px; border:1px solid #f5c5c5; }

    .accent-rule { height:2px; background:linear-gradient(90deg,var(--brand) 0%,transparent 100%); width:40px; margin:12px 0; border:none; }
    .prod-desc { font-size:13.5px; line-height:1.8; color:var(--muted); margin:0; }
    .thin-hr { height:1px; background:var(--line); border:none; margin:18px 0; }
    .s-label { font-size:10px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--ink); margin-bottom:8px; }

    /* color buttons */
    .c-btns { display:flex; gap:6px; flex-wrap:wrap; }
    .c-btn { padding:5px 12px; font-size:11px; font-weight:400; border:1.5px solid var(--line); background:none; cursor:pointer; transition:all .15s; border-radius:2px; color:var(--ink); font-family:'Outfit',sans-serif; }
    .c-btn:hover { border-color:var(--ink); transform:translateY(-1px); }
    .c-btn.on { border-color:var(--ink); background:var(--ink); color:var(--paper); }

    /* size buttons — modern, short + wide, solid black border */
    .sz-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
    .sz-guide { font-size:11px; color:var(--brand); text-decoration:underline; background:none; border:none; cursor:pointer; font-family:'Outfit',sans-serif; }
    .sz-btns { display:flex; gap:8px; flex-wrap:wrap; }
    .sz-btn {
      min-width:52px; height:32px; padding:0 14px;
      display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:500; letter-spacing:.04em; text-transform:uppercase;
      border:1.5px solid #000; background:none; cursor:pointer;
      transition:all .15s; border-radius:6px; color:var(--ink); font-family:'Outfit',sans-serif;
    }
    .sz-btn:hover { background:var(--hover); transform:translateY(-1px); }
    .sz-btn.on { background:#000; color:#fff; border-color:#000; }

    /* qty */
    .qty-wrap { display:inline-flex; border:1.5px solid var(--line); border-radius:2px; overflow:hidden; }
    .qty-btn { width:32px; height:34px; background:none; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .13s; color:var(--ink); }
    .qty-btn:hover { background:var(--hover); }
    .qty-n { width:38px; height:34px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:500; border-left:1px solid var(--line); border-right:1px solid var(--line); font-family:'Outfit',sans-serif; }

    /* ── CTAs ── */
    @keyframes btnPulse { 0%,100%{box-shadow:0 0 0 0 rgba(142,36,36,.35)} 50%{box-shadow:0 0 0 6px rgba(142,36,36,0)} }
    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes heartPop { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 70%{transform:scale(.9)} 100%{transform:scale(1)} }

    .cta-row { display:flex; gap:7px; margin-top:16px; flex-wrap:wrap; }

    .btn-add {
      flex:1; min-width:90px; padding:10px 8px;
      font-family:'Outfit',sans-serif; font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase;
      border:1.5px solid var(--ink); background:none; color:var(--ink); cursor:pointer;
      border-radius:2px; position:relative; overflow:hidden;
      transition:color .22s, border-color .22s, transform .15s;
    }
    .btn-add::before {
      content:''; position:absolute; inset:0; background:var(--ink);
      transform:translateX(-101%); transition:transform .28s cubic-bezier(.4,0,.2,1); z-index:0;
    }
    .btn-add:hover::before { transform:translateX(0); }
    .btn-add:hover { color:var(--paper); border-color:var(--ink); }
    .btn-add:active { transform:scale(.97); }
    .btn-add span { position:relative; z-index:1; }

    .btn-buy {
      flex:1; min-width:90px; padding:10px 8px;
      font-family:'Outfit',sans-serif; font-size:10px; font-weight:600; letter-spacing:.18em; text-transform:uppercase;
      border:1.5px solid var(--brand); background:var(--brand); color:#fff; cursor:pointer;
      border-radius:2px; position:relative; overflow:hidden;
      transition:transform .15s, box-shadow .2s;
      background-size:200% auto;
    }
    .btn-buy:hover { animation:btnPulse .6s ease; transform:translateY(-1px); box-shadow:0 4px 14px rgba(142,36,36,.32); }
    .btn-buy:active { transform:scale(.97); }
    .btn-buy::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.18) 50%,transparent 60%);
      background-size:200% auto;
      opacity:0; transition:opacity .2s;
    }
    .btn-buy:hover::after { opacity:1; animation:shimmer .6s linear; }
    .btn-buy span { position:relative; z-index:1; }

    .btn-heart {
      width:40px; height:40px; flex-shrink:0;
      border:1.5px solid var(--line); background:none;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; border-radius:2px; color:var(--ink);
      transition:border-color .2s, background .2s, transform .15s;
    }
    .btn-heart:hover { border-color:var(--brand); color:var(--brand); transform:scale(1.08); }
    .btn-heart.on { border-color:var(--brand); background:var(--brand); color:#fff; }
    .btn-heart.pop { animation:heartPop .38s ease; }

    /* trust strip — returns cell + payment logos cell */
    .trust { display:flex; align-items:center; margin-top:14px; border:1px solid var(--line); border-radius:3px; overflow:hidden; }
    .trust-cell { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 5px; border-right:1px solid var(--line); }
    .trust-cell:last-child { border-right:none; }
    .trust-cell svg { color:var(--brand); }
    .trust-cell span { font-size:9px; font-weight:500; letter-spacing:.05em; color:var(--muted); text-transform:uppercase; text-align:center; line-height:1.3; }
    .trust-pay-cell { flex:1; display:flex; align-items:center; justify-content:center; gap:10px; padding:10px 8px; }
    .trust-pay-sep { height:16px; width:1px; background:var(--line); }

    /* accordion */
    .acc { margin-top:20px; border-top:1px solid var(--line); }
    .acc-row { border-bottom:1px solid var(--line); }
    .acc-btn { width:100%; display:flex; align-items:center; justify-content:space-between; padding:12px 0; font-size:12px; font-weight:500; background:none; border:none; cursor:pointer; color:var(--ink); font-family:'Outfit',sans-serif; letter-spacing:.02em; transition:color .15s; }
    .acc-btn:hover { color:var(--brand); }
    .acc-body { padding-bottom:14px; }
    .blist { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; }
    .blist li { display:flex; align-items:flex-start; gap:8px; font-size:12.5px; color:var(--muted); line-height:1.65; }
    .bdot { width:4px; height:4px; border-radius:50%; background:var(--brand); flex-shrink:0; margin-top:7px; }

    /* ── SIMILAR PRODUCTS ── */
    .section-sep { display:flex; align-items:center; gap:14px; margin:56px 0 8px; }
    .sep-line { flex:1; height:1px; background:var(--line); }
    .sep-label { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; letter-spacing:.08em; color:var(--ink); white-space:nowrap; }
    .sep-label em { font-style:italic; color:var(--brand-lt); }
    .sep-sub { font-size:11.5px; color:var(--muted); text-align:center; margin:0 0 28px; letter-spacing:.03em; }

    .sim-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
    @media(min-width:640px){ .sim-grid { grid-template-columns:repeat(3,1fr); gap:12px; } }
    @media(min-width:960px){ .sim-grid { grid-template-columns:repeat(4,1fr); gap:14px; } }

    @keyframes cardFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

    .sim-card {
      background:var(--card); border:1px solid var(--line); border-radius:3px;
      overflow:hidden; cursor:pointer; position:relative;
      transition:box-shadow .22s, transform .22s;
      animation:cardFadeUp .4s ease both;
    }
    .sim-card:nth-child(1){ animation-delay:.05s }
    .sim-card:nth-child(2){ animation-delay:.1s }
    .sim-card:nth-child(3){ animation-delay:.15s }
    .sim-card:nth-child(4){ animation-delay:.2s }
    .sim-card:hover { box-shadow:0 6px 22px rgba(0,0,0,.08); transform:translateY(-2px); }
    .sim-img { aspect-ratio:3/4; overflow:hidden; background:#ede9e4; position:relative; }
    .sim-img img { width:100%; height:100%; object-fit:cover; transition:transform .48s; }
    .sim-card:hover .sim-img img { transform:scale(1.05); }
    .sim-add-overlay { position:absolute; inset:0; background:rgba(17,16,16,.36); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
    .sim-card:hover .sim-add-overlay { opacity:1; }
    .sim-add-btn {
      background:#fff; color:var(--ink);
      font-family:'Outfit',sans-serif; font-size:9.5px; font-weight:600; letter-spacing:.15em; text-transform:uppercase;
      padding:8px 16px; border:none; cursor:pointer; border-radius:2px;
      transition:background .16s, color .16s, transform .16s;
    }
    .sim-add-btn:hover { background:var(--brand); color:#fff; transform:scale(1.04); }
    .sim-body { padding:8px 10px 11px; }
    .sim-cat { font-size:9px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--brand); margin-bottom:2px; }
    .sim-name { font-family:'Cormorant Garamond',serif; font-size:14px; font-weight:400; color:var(--ink); line-height:1.25; margin-bottom:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .sim-price-row { display:flex; align-items:baseline; gap:6px; }
    .sim-price { font-size:12.5px; font-weight:600; color:var(--ink); }
    .sim-was { font-size:11px; color:var(--muted); text-decoration:line-through; }
    .sim-badge { position:absolute; top:8px; left:8px; background:var(--brand); color:#fff; font-size:8px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:3px 7px; border-radius:2px; }

    /* zoom modal */
    .zm-overlay { position:fixed; inset:0; background:rgba(8,7,6,.93); z-index:1000; display:flex; align-items:center; justify-content:center; animation:fdIn .22s ease; }
    @keyframes fdIn { from{opacity:0} to{opacity:1} }
    .zm-box { position:relative; max-width:86vw; max-height:90vh; display:flex; align-items:center; justify-content:center; }
    .zm-box img { max-width:86vw; max-height:88vh; object-fit:contain; border-radius:3px; }
    .zm-close { position:fixed; top:16px; right:16px; background:rgba(255,255,255,.1); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,.18); color:#fff; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .18s; z-index:5; }
    .zm-close:hover { background:rgba(255,255,255,.22); }
    .zm-nav { position:fixed; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.1); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,.18); color:#fff; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .18s; z-index:5; }
    .zm-nav:hover { background:rgba(255,255,255,.22); }
    .zm-nav.lf { left:16px; } .zm-nav.rt { right:16px; }
    .zm-ctr { position:fixed; bottom:18px; left:50%; transform:translateX(-50%); color:rgba(255,255,255,.45); font-family:'Outfit',sans-serif; font-size:12px; }

    /* size guide */
    .sg-overlay { position:fixed; inset:0; background:rgba(8,7,6,.6); z-index:999; display:flex; align-items:flex-end; justify-content:center; animation:fdIn .2s; }
    @media(min-width:560px){ .sg-overlay { align-items:center; } }
    .sg-sheet { background:var(--paper); width:100%; max-width:500px; border-radius:4px 4px 0 0; padding:26px 22px 30px; animation:slUp .28s cubic-bezier(.25,.46,.45,.94); max-height:88vh; overflow-y:auto; }
    @media(min-width:560px){ .sg-sheet { border-radius:4px; } }
    @keyframes slUp { from{transform:translateY(36px);opacity:0} to{transform:translateY(0);opacity:1} }
    .sg-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
    .sg-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; }
    .sg-x { background:none; border:none; cursor:pointer; color:var(--muted); transition:color .18s; }
    .sg-x:hover { color:var(--ink); }
    .sg-tbl { width:100%; border-collapse:collapse; font-size:12px; }
    .sg-tbl th { text-align:left; padding:6px 10px; font-weight:600; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; background:var(--hover); color:var(--muted); }
    .sg-tbl td { padding:8px 10px; border-bottom:1px solid var(--line); color:var(--ink); }
    .sg-tbl tr:last-child td { border-bottom:none; }
  `}</style>
);

/* helpers */
function BulletList({ content }) {
  if (!content) return null;
  return (
    <ul className="blist">
      {content.split('\n').map(l => l.trim()).filter(Boolean).map((l, i) => (
        <li key={i}><span className="bdot" />{l}</li>
      ))}
    </ul>
  );
}

function Stars({ rating = 4.5, count = 94 }) {
  return (
    <div className="rating-row">
      <div className="stars">
        {[1,2,3,4,5].map(n => <Star key={n} className={n <= Math.round(rating) ? 's-fill' : 's-mt'} size={13} />)}
      </div>
      <span className="r-count">{rating}</span>
      <button className="r-link">({count} reviews)</button>
    </div>
  );
}

/* Zoom modal */
function ZoomModal({ images, current, onClose, onPrev, onNext }) {
  useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, onPrev, onNext]);
  return (
    <div className="zm-overlay" onClick={onClose}>
      <div className="zm-box" onClick={e => e.stopPropagation()}>
        <img src={images[current]?.url || images[current]} alt="" />
      </div>
      <button className="zm-close" onClick={onClose}><X size={16} /></button>
      {images.length > 1 && <>
        <button className="zm-nav lf" onClick={onPrev}><ChevronLeft size={16} /></button>
        <button className="zm-nav rt" onClick={onNext}><ChevronRight size={16} /></button>
        <div className="zm-ctr">{current + 1} / {images.length}</div>
      </>}
    </div>
  );
}

/* Size guide sheet */
function SizeGuide({ onClose }) {
  const rows = [['XS','32–34"','26–28"','34–36"'],['S','34–36"','28–30"','36–38"'],['M','36–38"','30–32"','38–40"'],['L','38–40"','32–34"','40–42"'],['XL','40–42"','34–36"','42–44"']];
  return (
    <div className="sg-overlay" onClick={onClose}>
      <div className="sg-sheet" onClick={e => e.stopPropagation()}>
        <div className="sg-hd">
          <h2 className="sg-title">Size Guide</h2>
          <button className="sg-x" onClick={onClose}><X size={18} /></button>
        </div>
        <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.75, marginBottom:16 }}>
          Measurements in inches. Size up if between sizes.
        </p>
        <table className="sg-tbl">
          <thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Hip</th></tr></thead>
          <tbody>{rows.map(([s,c,w,h]) => <tr key={s}><td>{s}</td><td>{c}</td><td>{w}</td><td>{h}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

/* Similar card */
function SimCard({ product: p, isNew }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const img = getProductImage(p);
  return (
    <div className="sim-card" onClick={() => navigate(`/product/${p.id}`)}>
      <div className="sim-img">
        <img src={img} alt={p.name} />
        {isNew && <span className="sim-badge">New</span>}
        <div className="sim-add-overlay">
          <button className="sim-add-btn" onClick={e => { e.stopPropagation(); addToCart(p, p.sizes?.[0] || '', p.colors?.[0] || '', 1); }}>
            + Quick Add
          </button>
        </div>
      </div>
      <div className="sim-body">
        {p.category && <div className="sim-cat">{p.category}</div>}
        <div className="sim-name">{p.name}</div>
        <div className="sim-price-row">
          <span className="sim-price">{formatPrice(p.price)}</span>
          {p.original_price && <span className="sim-was">{formatPrice(p.original_price)}</span>}
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function ProductDetail() {
  

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selImg,   setSelImg]   = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [selSize,  setSelSize]  = useState('');
  const [qty,      setQty]      = useState(1);
  const [acc,      setAcc]      = useState('details');
  const [zoom,     setZoom]     = useState(false);
  const [sizeG,    setSizeG]    = useState(false);
  const [liked,    setLiked]    = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  useEffect(() => {
    setSelImg(0); setSelColor(0); setSelSize(''); setQty(1);
    window.scrollTo(0, 0);
  }, [id]);

  const { data: product, isLoading } = useQuery({ queryKey:['product',id], queryFn:()=>fetchProductById(id) });
  const { data: related = [] } = useQuery({ queryKey:['related',product?.category,id], queryFn:()=>fetchRelatedProducts(product), enabled:!!product });

useEffect(() => {
  if (!product) return;
  trackViewContent(product);
}, [product]);


  const images  = product ? getProductImages(product) : [];
  const mainImg = images[selImg]?.url || (product ? getProductImage(product) : '');
  const zPrev   = useCallback(()=>setSelImg(i=>(i-1+images.length)%images.length),[images.length]);
  const zNext   = useCallback(()=>setSelImg(i=>(i+1)%images.length),[images.length]);

  const addCart = () => { if (!selSize){alert('Please select a size');return;} addToCart(product,selSize,product.colors?.[selColor]||'',qty); };
  const buyNow  = () => { if (!selSize){alert('Please select a size');return;} addToCart(product,selSize,product.colors?.[selColor]||'',qty); navigate('/cart'); };

  const toggleLike = () => {
    setLiked(l=>!l);
    setHeartAnim(true);
    setTimeout(()=>setHeartAnim(false), 400);
  };

  const discPct = product?.original_price ? Math.round((1-product.price/product.original_price)*100) : null;
  const accordions = [
    { key:'details',  title:'Product Details',   content:product?.details  },
    { key:'shipping', title:'Shipping & Returns', content:product?.shipping },
    { key:'care',     title:'Care Instructions',  content:product?.care     },
  ];

  if (isLoading) return (
    <div className="pdp"><FontStyle />
      <div className="pdp-grid">
        <div style={{aspectRatio:'3/4',background:'#e8e4df',borderRadius:3}} />
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[22,180,42,72,108].map((h,i)=><div key={i} style={{height:h,background:'#e8e4df',borderRadius:2}} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="pdp" style={{textAlign:'center',paddingTop:80}}><FontStyle />
      <p style={{color:'var(--muted)',fontFamily:'Outfit,sans-serif'}}>Product not found.</p>
      <Link to="/shop" style={{color:'var(--brand)',marginTop:12,display:'inline-block',fontFamily:'Outfit,sans-serif'}}>Back to Shop</Link>
    </div>
  );

  return (
    <>
      <FontStyle />
      <div className="pdp">

        {/* top bar */}
        <div className="top-bar">
          <button className="back-btn" onClick={()=>navigate(-1)}><ArrowLeft size={13}/> Back</button>
          <nav className="bc" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span className="bc-sep">/</span>
            <Link to="/shop">Shop</Link><span className="bc-sep">/</span>
            {product.category&&<><Link to={`/shop?category=${product.category}`}>{product.category}</Link><span className="bc-sep">/</span></>}
            <span className="bc-now">{product.name}</span>
          </nav>
          <button className="share-btn" onClick={()=>navigator.share?.({title:product.name,url:window.location.href})}>
            <Share2 size={13}/> Share
          </button>
        </div>

        <div className="pdp-grid">
          {/* Gallery */}
          <div className="gallery">
            <div className="main-frame" onClick={()=>setZoom(true)}>
              <img src={mainImg} alt={product.name} />
              {discPct && <div className="sale-tag">−{discPct}%</div>}
              <div className="zoom-hint"><ZoomIn size={10}/> Zoom</div>
            </div>
            {images.length>1 && (
              <div className="thumbs">
                {images.map((img,i)=>(
                  <div key={img.id||i} className={`thumb${selImg===i?' on':''}`} onClick={()=>setSelImg(i)}>
                    <img src={img.url||img} alt={product.name}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="info">
            <span className="brand-eyebrow">SMYT Collection</span>
            <h1 className="prod-title">{product.name}</h1>
            <Stars rating={4.6} count={94}/>

            <div className="price-row">
              <span className="p-now">{formatPrice(product.price)}</span>
              {product.original_price&&<span className="p-was">{formatPrice(product.original_price)}</span>}
              {discPct&&<span className="p-save">Save {discPct}%</span>}
            </div>

            <hr className="accent-rule"/>
            {product.description&&<p className="prod-desc">{product.description}</p>}
            <hr className="thin-hr"/>

            {/* Colors */}
            {product.colors?.length>0&&(
              <div style={{marginBottom:16}}>
                <div className="s-label">Colour — <span style={{fontWeight:300,textTransform:'none',letterSpacing:0}}>{product.colors[selColor]}</span></div>
                <div className="c-btns">
                  {product.colors.map((c,i)=><button key={i} className={`c-btn${selColor===i?' on':''}`} onClick={()=>setSelColor(i)}>{c}</button>)}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length>0&&(
              <div style={{marginBottom:16}}>
                <div className="sz-header">
                  <span className="s-label" style={{margin:0}}>Size</span>
                  <button className="sz-guide" onClick={()=>setSizeG(true)}>Size Guide</button>
                </div>
                <div className="sz-btns">
                  {product.sizes.map(s=><button key={s} className={`sz-btn${selSize===s?' on':''}`} onClick={()=>setSelSize(s)}>{s}</button>)}
                </div>
              </div>
            )}

            {/* Qty */}
            <div style={{marginBottom:0}}>
              <div className="s-label">Quantity</div>
              <div className="qty-wrap">
                <button className="qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}><Minus size={13}/></button>
                <div className="qty-n">{qty}</div>
                <button className="qty-btn" onClick={()=>setQty(q=>q+1)}><Plus size={13}/></button>
              </div>
            </div>

            {/* CTAs */}
            <div className="cta-row">
              <button className="btn-add" onClick={addCart}><span>Add to Cart</span></button>
              <button className="btn-buy" onClick={buyNow}><span>Buy Now</span></button>
              <button className={`btn-heart${liked?' on':''}${heartAnim?' pop':''}`} onClick={toggleLike} aria-label="Wishlist">
                <Heart size={15} fill={liked?'#fff':'none'}/>
              </button>
            </div>

            {/* Trust strip */}
            <div className="trust">
              <div className="trust-cell"><RotateCcw size={14}/><span>30-Day Returns</span></div>
              <div className="trust-pay-cell">
                <PaystackLogo height="h-4" />
                <div className="trust-pay-sep" />
                <VerveLogo height="h-4" />
                <div className="trust-pay-sep" />
                <MastercardLogo height="h-4" />
              </div>
            </div>

            {/* Accordions */}
            <div className="acc">
              {accordions.map(a=>a.content?(
                <div key={a.key} className="acc-row">
                  <button className="acc-btn" onClick={()=>setAcc(acc===a.key?'':a.key)}>
                    {a.title}
                    {acc===a.key?<ChevronUp size={13}/>:<ChevronDown size={13}/>}
                  </button>
                  {acc===a.key&&<div className="acc-body"><BulletList content={a.content}/></div>}
                </div>
              ):null)}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {related.length>0&&(
          <section>
            <div className="section-sep">
              <div className="sep-line"/>
              <h2 className="sep-label">You May Also <em>Like</em></h2>
              <div className="sep-line"/>
            </div>
            <p className="sep-sub">Curated pieces that pair beautifully with this item</p>
            <div className="sim-grid">
              {related.map((p,i)=><SimCard key={p.id} product={p} isNew={i<2}/>)}
            </div>
          </section>
        )}
      </div>

      {zoom  && <ZoomModal images={images} current={selImg} onClose={()=>setZoom(false)} onPrev={zPrev} onNext={zNext}/>}
      {sizeG && <SizeGuide onClose={()=>setSizeG(false)}/>}
    </>
  );
}