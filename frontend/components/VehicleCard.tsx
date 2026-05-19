"use client";

import { motion } from "framer-motion";
import {
  Star, ArrowRight, Car, Bike, Zap, Gauge, Fuel,
  Heart, ShoppingCart, Settings, Users, Shield,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/* ─── Types ─────────────────────────────────────────────────── */
export type FuelType    = "Electric" | "Petrol" | "Diesel" | "Hybrid" | "CNG" | "LPG";
export type VehicleType = "Car" | "Bike" | "SUV" | "Truck" | "Van" | "Electric";

export interface ColorVariant {
  color_name: string;
  hex_code:   string;
  image_url:  string;
}

export interface VehicleCardProps {
  id:               string | number;
  name:             string;
  brand:            string;
  type:             VehicleType;
  fuel?:            FuelType;
  fueltype?:        string;
  price:            string;
  rating?:          number;
  reviews?:         number;
  // Specs from admin
  engine?:          string;
  transmission?:    string;
  horsepower?:      number;
  torque?:          string;
  mileage?:         string;
  range?:           string;
  seats?:           number;
  top_speed?:       number | string;
  warranty?:        string;
  // Images
  image:            string;
  color_variants?:  ColorVariant[];
  // UI
  tag?:             string;
  tagGradient?:     string;
  aiScore?:         number;
  onView?:          (id: string | number) => void;
  onWishlist?:      (id: string | number, wishlisted: boolean) => void;
  onCart?:          (id: string | number) => void;
  variant?:         "default" | "compact" | "horizontal";
  index?:           number;
}

/* ─── Fuel badge meta ───────────────────────────────────────── */
const FUEL_STYLE: Record<string, { text: string; bg: string }> = {
  Electric: { text: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/25"    },
  Petrol:   { text: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/25" },
  Diesel:   { text: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/25" },
  Hybrid:   { text: "text-green-400",   bg: "bg-green-500/10 border-green-500/25"  },
  CNG:      { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" },
  LPG:      { text: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/25"    },
  default:  { text: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/25"  },
};

const TRANS_SHORT: Record<string, string> = {
  Manual: "MT", Automatic: "AT", AMT: "AMT", CVT: "CVT", "DCT": "DCT",
};

/* ─── VehicleCard ───────────────────────────────────────────── */
export default function VehicleCard({
  id, name, brand, type, fuel, fueltype,
  price, rating = 4.5, reviews,
  engine, transmission, horsepower, mileage, range, seats, top_speed, warranty,
  image, color_variants,
  tag, tagGradient = "from-cyan-500 to-blue-600",
  aiScore, onView, onWishlist, onCart,
  variant = "default", index = 0,
}: VehicleCardProps) {
  const [wishlisted,    setWishlisted]    = useState(false);
  const [addedToCart,   setAddedToCart]   = useState(false);
  const [activeColor,   setActiveColor]   = useState(0);

  const fuelLabel = fueltype || fuel || "Petrol";
  const fuelStyle = FUEL_STYLE[fuelLabel] ?? FUEL_STYLE.default;

  // Active color image or fallback
  const colors   = Array.isArray(color_variants) ? color_variants : [];
  const imgSrc   = (colors[activeColor]?.image_url) || image ||
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80";

  const handleWishlist = () => { const n = !wishlisted; setWishlisted(n); onWishlist?.(id, n); };
  const handleCart     = () => { setAddedToCart(true); onCart?.(id); setTimeout(() => setAddedToCart(false), 2000); };

  /* ── Spec pills ─────────────────────────────────────────────── */
  const specPills = [
    engine        && { Icon: Settings, val: engine.length > 14 ? engine.slice(0, 14) + "…" : engine, sub: "Engine" },
    transmission  && { Icon: Zap,      val: TRANS_SHORT[transmission] ?? transmission, sub: "Trans" },
    horsepower    && { Icon: Gauge,    val: `${horsepower} bhp`, sub: "Power" },
    mileage       && { Icon: Fuel,     val: mileage, sub: "Mileage" },
    range         && { Icon: Zap,      val: range, sub: "Range" },
    seats         && { Icon: Users,    val: `${seats} Seats`, sub: "Capacity" },
    top_speed     && { Icon: Gauge,    val: String(top_speed).includes('km/h') ? String(top_speed) : `${top_speed} km/h`, sub: "Top Speed" },
  ].filter(Boolean) as { Icon: React.ElementType; val: string; sub: string }[];

  /* ── Compact variant ────────────────────────────────────────── */
  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        className="group rounded-xl overflow-hidden border border-white/[0.07]
          bg-white/[0.03] hover:border-cyan-500/25
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(0,212,255,0.08)]
          transition-all duration-300"
      >
        <div className="relative h-36 overflow-hidden">
          <Image src={imgSrc} alt={`${brand} ${name}`} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1526] to-transparent" />
          {tag && <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${tagGradient} text-white`}>{tag}</span>}
        </div>
        <div className="p-3">
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">{brand}</p>
          <h3 className="font-display font-bold text-sm text-white truncate group-hover:text-cyan-400 transition-colors">{name}</h3>
          {colors.length > 1 && (
            <div className="flex gap-1 mt-1.5">
              {colors.slice(0, 5).map((c, i) => (
                <button key={i} title={c.color_name} onClick={e => { e.preventDefault(); setActiveColor(i); }}
                  className={`w-3 h-3 rounded-full border transition-all ${activeColor === i ? "border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex_code || "#888" }} />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="font-display font-black text-sm bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">{price}</span>
            <div className="flex items-center gap-1">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{rating}</span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  /* ── Horizontal variant ─────────────────────────────────────── */
  if (variant === "horizontal") {
    return (
      <motion.article
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ scale: 1.01 }}
        className="group flex rounded-2xl overflow-hidden border border-white/[0.07]
          bg-gradient-to-r from-white/[0.04] to-white/[0.01]
          hover:border-cyan-500/30
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(0,212,255,0.08)]
          transition-all duration-400"
      >
        <div className="relative w-44 sm:w-56 flex-shrink-0 overflow-hidden">
          <Image src={imgSrc} alt={`${brand} ${name}`} fill sizes="224px"
            className="object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D1526]/60" />
          {tag && <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${tagGradient} text-white`}>{tag}</span>}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider truncate">{brand}</p>
              <h3 className="font-display font-bold text-white text-base truncate group-hover:text-cyan-400 transition-colors">{name}</h3>
            </div>
            <button onClick={handleWishlist} className="flex-shrink-0 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/15 transition-colors">
              <Heart size={12} className={wishlisted ? "text-red-400 fill-red-400" : "text-white/50"} />
            </button>
          </div>

          {/* Quick specs row */}
          {specPills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {specPills.slice(0, 4).map(({ Icon, val, sub }) => (
                <span key={sub} className="flex items-center gap-1 text-[10px] bg-white/[0.04] border border-white/[0.07] rounded-lg px-2 py-1 text-slate-300">
                  <Icon size={9} className="text-cyan-400 shrink-0" />
                  {val}
                </span>
              ))}
            </div>
          )}

          {/* Color swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Colors</span>
              <div className="flex gap-1">
                {colors.map((c, i) => (
                  <button key={i} title={c.color_name} onClick={e => { e.preventDefault(); setActiveColor(i); }}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${activeColor === i ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"}`}
                    style={{ backgroundColor: c.hex_code || "#888" }} />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 mt-auto">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">{rating}</span>
            {reviews && <span className="text-[10px] text-slate-500">({reviews.toLocaleString()})</span>}
          </div>

          <div className="flex gap-1.5 pt-2 border-t border-white/[0.06]">
            <span className="font-display font-black text-base bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent flex-1">{price}</span>
            <button onClick={() => onView?.(id)}
              className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border border-cyan-500/25 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all">
              View
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  /* ── Default variant (full card) ────────────────────────────── */
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative rounded-2xl overflow-hidden flex flex-col
        border border-white/[0.07]
        bg-gradient-to-b from-white/[0.04] to-white/[0.01]
        hover:border-cyan-500/30
        hover:shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_48px_rgba(0,212,255,0.12)]
        transition-all duration-500"
    >
      {/* ── Image ── */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <Image
          src={imgSrc}
          alt={`${brand} ${name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1526] via-[#0D1526]/10 to-transparent" />

        {/* Top row: tag + fuel + wishlist */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {tag ? (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${tagGradient} text-white shadow-md`}>{tag}</span>
          ) : <span />}
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${fuelStyle.bg} ${fuelStyle.text}`}>{fuelLabel}</span>
            <button onClick={handleWishlist} aria-label="Toggle wishlist"
              className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10
                flex items-center justify-center hover:bg-red-500/20 hover:border-red-400/30 transition-colors">
              <Heart size={12} className={wishlisted ? "text-red-400 fill-red-400" : "text-white/60"} />
            </button>
          </div>
        </div>

        {/* Vehicle type badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-medium
          text-white/70 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
          {type === "Car" || type === "SUV" ? <Car size={10} /> : type === "Bike" ? <Bike size={10} /> : <Zap size={10} />}
          {type}
        </div>

        {/* Color variant count badge */}
        {colors.length > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-medium
            text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: colors[activeColor]?.hex_code || "#888" }} />
            {colors.length} color{colors.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5">

        {/* Name + rating */}
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 truncate">{brand}</p>
            <h3 className="font-display font-bold text-[1.05rem] text-white truncate
              group-hover:text-cyan-400 transition-colors duration-300">{name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-white">{rating}</span>
            </div>
            {reviews && <p className="text-[10px] text-slate-500">{reviews.toLocaleString()} reviews</p>}
          </div>
        </div>

        {/* Color swatches selector */}
        {colors.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Color</span>
              <span className="text-[10px] text-cyan-400 font-medium">{colors[activeColor]?.color_name}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c, i) => (
                <button
                  key={i}
                  title={c.color_name}
                  onClick={e => { e.preventDefault(); setActiveColor(i); }}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    activeColor === i
                      ? "border-white scale-110 shadow-lg shadow-white/20"
                      : "border-white/20 hover:border-white/50 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.hex_code || "#888" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Specs grid */}
        {specPills.length > 0 && (
          <div className={`grid gap-2 mb-4 ${
            specPills.length >= 4 ? "grid-cols-3" :
            specPills.length === 3 ? "grid-cols-3" :
            specPills.length === 2 ? "grid-cols-2" : "grid-cols-1"
          }`}>
            {specPills.slice(0, 6).map(({ Icon, val, sub }) => (
              <div key={sub} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-2 py-2.5 text-center hover:border-cyan-500/20 transition-colors">
                <Icon size={12} className="text-cyan-400 mx-auto mb-1.5" />
                <div className="text-[10px] font-semibold text-white leading-none">{val}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Warranty badge */}
        {warranty && (
          <div className="flex items-center gap-1.5 mb-3 text-[10px] text-slate-400 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5">
            <Shield size={10} className="text-green-400 shrink-0" />
            <span><span className="text-green-400 font-medium">Warranty:</span> {warranty}</span>
          </div>
        )}

        {/* Price + actions */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-white/[0.06]">
          <div className="min-w-0">
            <div className="text-[10px] text-slate-500 mb-0.5">Starting from</div>
            <div className="font-display font-black text-xl bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent whitespace-nowrap">
              {price}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCart}
              aria-label="Add to cart"
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                addedToCart
                  ? "bg-green-500/20 border-green-500/40 text-green-400"
                  : "bg-white/[0.05] border-white/[0.08] text-slate-400 hover:bg-cyan-500/15 hover:border-cyan-500/30 hover:text-cyan-400"
              }`}
            >
              <ShoppingCart size={13} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView?.(id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                bg-gradient-to-r from-cyan-500/20 to-violet-600/20
                border border-cyan-500/25 text-cyan-300
                hover:from-cyan-500/30 hover:to-violet-600/30
                hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/15
                transition-all duration-200"
            >
              View <ArrowRight size={12} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* AI Score hover badge */}
      {aiScore !== undefined && (
        <div className="absolute bottom-[5.5rem] right-4
          flex items-center gap-1.5 px-2.5 py-1.5
          bg-[#050B18]/90 backdrop-blur-md border border-cyan-500/30 rounded-lg
          text-[10px] font-semibold text-cyan-300
          opacity-0 group-hover:opacity-100
          translate-y-1 group-hover:translate-y-0
          transition-all duration-300">
          <Zap size={10} fill="currentColor" />
          AI Score: {aiScore}%
        </div>
      )}
    </motion.article>
  );
}
