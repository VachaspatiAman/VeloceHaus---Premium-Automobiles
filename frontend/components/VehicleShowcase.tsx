"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Gauge, Zap, Cog, ChevronDown, Star, ShoppingCart, Heart,
  ArrowLeft, Maximize2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Types ───────────────────────────────────────────────────── */
export interface ShowcaseVehicle {
  name:         string;
  brand:        string;
  model?:       string;       // e.g. "GT · Sport Edition"
  image:        string;
  price:        number;       // in rupees
  speed:        string;       // "167 km/h"
  acceleration: string;       // "4.8s"
  transmission: string;
  description?: string;
  rating?:      number;
  colors?: {
    label: string;
    hex:   string;
    image?: string;           // optional per-color image
  }[];
  wheels?: string[];
}

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/* ─── Sub-components ──────────────────────────────────────────── */

/** One small spec block */
function SpecBlock({
  icon: Icon, value, label,
}: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon size={12} className="text-white/40" />
        <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/40">{label}</span>
      </div>
      <span className="font-display font-black text-white text-2xl sm:text-3xl leading-none tracking-tight">
        {value}
      </span>
    </div>
  );
}

/** Color swatch dot */
function ColorDot({
  color, active, onClick,
}: {
  color: { label: string; hex: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.25 }}
      whileTap={{ scale: 0.95 }}
      title={color.label}
      aria-label={`Select color: ${color.label}`}
      className={`relative w-6 h-6 rounded-full transition-all duration-200 ${
        active ? "ring-2 ring-offset-2 ring-offset-transparent ring-white/70 scale-110" : ""
      }`}
      style={{ backgroundColor: color.hex }}
    >
      {active && (
        <motion.div
          layoutId="colorRing"
          className="absolute inset-0 rounded-full ring-2 ring-white/60"
        />
      )}
    </motion.button>
  );
}

/* ─── VehicleShowcase ─────────────────────────────────────────── */
export default function VehicleShowcase({
  vehicle,
  onBack,
  onCart,
  onWishlist,
}: {
  vehicle:    ShowcaseVehicle;
  onBack?:    () => void;
  onCart?:    () => void;
  onWishlist?: () => void;
}) {
  /* ── State ── */
  const [activeColor,  setActiveColor]  = useState(0);
  const [activeWheel,  setActiveWheel]  = useState(0);
  const [wishlist,     setWishlist]     = useState(false);
  const [carted,       setCarted]       = useState(false);
  const [wheelOpen,    setWheelOpen]    = useState(false);
  const [fullscreen,   setFullscreen]   = useState(false);
  const [imageLoaded,  setImageLoaded]  = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Mouse parallax ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imgX = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), { stiffness: 50, damping: 20 });
  const imgY = useSpring(useTransform(mouseY, [-1, 1], [-8,  8]),  { stiffness: 50, damping: 20 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      mouseX.set(((e.clientX - left) / width  - 0.5) * 2);
      mouseY.set(((e.clientY - top)  / height - 0.5) * 2);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  /* ── Derived values ── */
  const currentColor  = vehicle.colors?.[activeColor];
  const currentImage  = currentColor?.image ?? vehicle.image;
  const wheels        = vehicle.wheels ?? ["Standard", "Sport 19\"", "Turbo 21\""];
  const colors        = vehicle.colors ?? [
    { label: "Midnight Black",  hex: "#0f0f0f" },
    { label: "Arctic White",    hex: "#f4f4f2" },
    { label: "Neon Cyan",       hex: "#00D4FF" },
    { label: "Deep Violet",     hex: "#4c1d95" },
    { label: "Racing Red",      hex: "#dc2626" },
  ];
  const description = vehicle.description ??
    `The ${vehicle.brand} ${vehicle.name} merges engineering precision with bold aesthetics. ` +
    `Engineered for performance and crafted for desire — every detail is purposeful.`;

  /* ── Handlers ── */
  const handleCart = () => {
    setCarted(true);
    onCart?.();
    setTimeout(() => setCarted(false), 2500);
  };
  const handleWishlist = () => {
    setWishlist((w) => !w);
    onWishlist?.();
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative bg-[#050B18] overflow-hidden select-none ${
        fullscreen ? "fixed inset-0 z-[100]" : "w-full min-h-screen"
      }`}
    >

      {/* ════════════════════════════════════════════════
          BACKGROUND — fullscreen vehicle image
      ════════════════════════════════════════════════ */}
      <AnimatePresence>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ x: imgX, y: imgY }}
          className="absolute inset-[-3%]"    /* extra size for parallax room */
        >
          <Image
            src={currentImage}
            alt={`${vehicle.brand} ${vehicle.name}`}
            fill
            className="object-cover"
            priority
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Layered overlays ── */}
      {/* radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
      {/* bottom-heavy gradient — keeps text legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/30 to-transparent" />
      {/* subtle top gradient for nav area */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* ════════════════════════════════════════════════
          TOP BAR
      ════════════════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 pt-7">
        {/* Back */}
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </motion.button>
        )}

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display font-black text-white tracking-widest text-sm uppercase mx-auto"
        >
          {vehicle.brand}
        </motion.div>

        {/* Fullscreen toggle */}
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => setFullscreen((v) => !v)}
          className="text-white/50 hover:text-white transition-colors"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 size={17} />
        </motion.button>
      </div>

      {/* ════════════════════════════════════════════════
          MAIN CONTENT — pinned to bottom above panel
      ════════════════════════════════════════════════ */}
      <div className="absolute left-0 right-0 bottom-[220px] sm:bottom-[200px] z-20 px-6 sm:px-12 lg:px-16">
        <div className="flex items-end justify-between gap-6">

          {/* ── LEFT: Vehicle name ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-[55%]"
          >
            {/* Label above */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-white/40">
                {vehicle.model ?? "Vehicle"}
              </span>
              {vehicle.rating && (
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-bold text-white/60">{vehicle.rating}</span>
                </div>
              )}
            </div>

            {/* Vehicle name */}
            <h1
              className="font-display font-black text-white leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}
            >
              {vehicle.name}
            </h1>
          </motion.div>

          {/* ── RIGHT: Specs ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-end gap-8 sm:gap-12"
          >
            <SpecBlock icon={Gauge} value={vehicle.speed}        label="Top Speed"    />
            <SpecBlock icon={Zap}   value={vehicle.acceleration} label="0–100 km/h"   />
            <SpecBlock icon={Cog}   value={vehicle.transmission} label="Transmission" />
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          BOTTOM GLASS CONTROL PANEL
      ════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute bottom-0 left-0 right-0 z-30"
      >
        {/* Glass backdrop */}
        <div
          className="mx-4 sm:mx-8 mb-4 sm:mb-6 rounded-2xl overflow-hidden"
          style={{
            background:       "rgba(8, 15, 30, 0.65)",
            backdropFilter:   "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border:           "1px solid rgba(255,255,255,0.09)",
            boxShadow:        "0 -8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* Thin top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-white/[0.07]">

            {/* ── 1: Description ── */}
            <div className="px-5 py-5">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-semibold block mb-2">
                About
              </span>
              <p className="text-white/65 text-[11px] leading-relaxed line-clamp-3">
                {description}
              </p>
            </div>

            {/* ── 2: Exterior Color ── */}
            <div className="px-5 py-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-semibold">
                  Exterior
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeColor}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-[10px] font-semibold text-white/55"
                  >
                    {colors[activeColor]?.label ?? "—"}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {colors.map((c, i) => (
                  <ColorDot
                    key={i}
                    color={c}
                    active={activeColor === i}
                    onClick={() => { setActiveColor(i); setImageLoaded(false); }}
                  />
                ))}
              </div>
            </div>

            {/* ── 3: Wheels ── */}
            <div className="px-5 py-5 relative">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-semibold block mb-3">
                Wheels
              </span>
              <button
                onClick={() => setWheelOpen((v) => !v)}
                className="flex items-center gap-2 text-white/80 text-sm font-semibold hover:text-white transition-colors"
              >
                {wheels[activeWheel]}
                <ChevronDown
                  size={14}
                  className={`text-white/40 transition-transform ${wheelOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {wheelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full left-5 mb-2 w-44 rounded-xl overflow-hidden z-50"
                    style={{
                      background: "rgba(10, 20, 40, 0.92)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    }}
                  >
                    {wheels.map((w, i) => (
                      <button
                        key={w}
                        onClick={() => { setActiveWheel(i); setWheelOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          activeWheel === i
                            ? "text-cyan-400 bg-cyan-500/10"
                            : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── 4: Price + CTAs ── */}
            <div className="px-5 py-5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-semibold block mb-1">
                  Ex-showroom Price
                </span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeColor}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="font-display font-black text-xl sm:text-2xl text-white leading-none"
                  >
                    {fmt(vehicle.price)}
                  </motion.div>
                </AnimatePresence>
                <div className="text-[10px] text-white/30 mt-1">
                  EMI ~{fmt(Math.round(vehicle.price / 60))}/mo
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCart}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 justify-center ${
                    carted
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20"
                  }`}
                >
                  <ShoppingCart size={13} />
                  {carted ? "Added!" : "Reserve"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleWishlist}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all ${
                    wishlist
                      ? "bg-red-500/20 border-red-500/30 text-red-400"
                      : "bg-white/[0.06] border-white/[0.1] text-white/50 hover:text-red-400 hover:border-red-500/30"
                  }`}
                >
                  <Heart size={14} className={wishlist ? "fill-red-400" : ""} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Keyboard hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 text-[10px] text-white/20 font-medium pointer-events-none"
      >
        <span className="w-1 h-1 rounded-full bg-white/20 animate-pulse" />
        Move cursor to explore parallax
      </motion.div>
    </motion.div>
  );
}
