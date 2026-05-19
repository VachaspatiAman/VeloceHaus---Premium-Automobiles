"use client";

import { motion } from "framer-motion";
import { Car, Bike, ArrowRight, Zap, BarChart3, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "cars",
    label: "Cars",
    count: "250+ Models",
    icon: Car,
    href: "/vehicles?type=Car",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&q=80",
    cta: "Browse Cars",
    gradFrom: "#06B6D4",
    gradTo: "#2563EB",
    glowColor: "rgba(6,182,212,0.2)",
    tagline: "From city hatchbacks to luxury SUVs",
    tags: ["⚡ Electric", "🚙 SUVs", "🚗 Sedans", "🏎️ Hatchbacks"],
    stats: [
      { icon: BarChart3, val: "97%",    lbl: "Verified"   },
      { icon: Zap,       val: "4.8★",   lbl: "Avg Rating" },
      { icon: MapPin,    val: "Pan-IN", lbl: "Delivery"   },
    ],
  },
  {
    id: "bikes",
    label: "Bikes",
    count: "150+ Models",
    icon: Bike,
    href: "/vehicles?type=Bike",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80",
    cta: "Browse Bikes",
    gradFrom: "#8B5CF6",
    gradTo: "#EC4899",
    glowColor: "rgba(139,92,246,0.2)",
    tagline: "From daily commuters to performance machines",
    tags: ["🛵 Cruisers", "🏍️ Sports", "🌄 Adventure", "🛺 Commuters"],
    stats: [
      { icon: BarChart3, val: "95%",    lbl: "Verified"   },
      { icon: Zap,       val: "4.7★",   lbl: "Avg Rating" },
      { icon: MapPin,    val: "50+",    lbl: "Cities"     },
    ],
  },
];

export default function CategorySection() {
  return (
    <section id="categories" className="relative py-28 overflow-hidden">
      {/* Background subtle noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ background: "var(--surface-raised)" }}
      />
      {/* Ambient orbs */}
      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-10" style={{ background: "linear-gradient(to right, transparent, #00D4FF)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#00D4FF" }}>
              ✦ Explore
            </span>
            <div className="h-px w-10" style={{ background: "linear-gradient(to left, transparent, #8B5CF6)" }} />
          </div>
          <h2
            className="font-display font-black leading-tight"
            style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              color: "var(--content)",
            }}
          >
            What are you{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF 0%, #8B5CF6 50%, #EC4899 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              looking for?
            </span>
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "var(--content-muted)" }}>
            Discover the full range — from eco-friendly city EVs to thundering adventure bikes.
          </p>
        </motion.div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={cat.href}
                  className="group relative block overflow-hidden"
                  style={{ borderRadius: "28px", minHeight: "460px" }}
                >
                  {/* Background image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                      style={{ filter: "brightness(0.38)" }}
                    />
                  </div>

                  {/* Dark gradient overlays */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(3,8,15,0.95) 0%, rgba(3,8,15,0.4) 50%, transparent 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, rgba(3,8,15,0.5) 0%, transparent 60%)`,
                    }}
                  />

                  {/* Hover glow border */}
                  <div
                    className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 0 1.5px ${cat.gradFrom}66`,
                    }}
                  />

                  {/* Glow splash at bottom */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-48 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse, ${cat.glowColor} 0%, transparent 70%)`,
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Content */}
                  <div
                    className="relative z-10 flex flex-col justify-between p-8 sm:p-10"
                    style={{ minHeight: "460px" }}
                  >

                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
                        style={{
                          background: `linear-gradient(135deg, ${cat.gradFrom}, ${cat.gradTo})`,
                          boxShadow: `0 8px 24px ${cat.glowColor}`,
                        }}
                      >
                        <Icon size={24} className="text-white" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold px-3.5 py-1.5 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.65)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {cat.count}
                        </span>
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {cat.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-semibold px-3 py-1 rounded-full"
                            style={{
                              background: "rgba(255,255,255,0.07)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.65)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Main label */}
                      <h3
                        className="font-display font-black text-white leading-none mb-2"
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                      >
                        {cat.label}
                      </h3>
                      <p className="text-slate-400 text-sm mb-6">{cat.tagline}</p>

                      {/* Quick stats row */}
                      <div className="flex gap-5 mb-7">
                        {cat.stats.map(({ icon: SIcon, val, lbl }) => (
                          <div key={lbl} className="flex items-center gap-1.5">
                            <SIcon size={11} style={{ color: cat.gradFrom }} />
                            <div>
                              <div className="text-xs font-black text-white">{val}</div>
                              <div className="text-[9px] text-white/35 uppercase tracking-wide">{lbl}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTA button */}
                      <motion.div
                        whileHover={{ scale: 1.04, x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-white text-sm font-bold shadow-xl"
                        style={{
                          background: `linear-gradient(135deg, ${cat.gradFrom}, ${cat.gradTo})`,
                          boxShadow: `0 6px 24px ${cat.glowColor}`,
                        }}
                      >
                        <Zap size={14} />
                        {cat.cta}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
