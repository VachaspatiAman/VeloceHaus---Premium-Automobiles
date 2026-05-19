"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Eye,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import VehicleCard, { type VehicleCardProps } from "@/components/VehicleCard";

/* ─── Mock Data ─────────────────────────────────────────────── */
const RECOMMENDED: VehicleCardProps[] = [
  {
    id: 101,
    name: "Nexon EV Max",
    brand: "Tata",
    type: "Car",
    fuel: "Electric",
    price: "₹18.99 L",
    rating: 4.7,
    reviews: 3210,
    range: "437 km",
    top_speed: "150 km/h",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80",
    tag: "AI Pick",
    tagGradient: "from-cyan-500 to-violet-600",
    aiScore: 98,
  },
  {
    id: 102,
    name: "Punch EV",
    brand: "Tata",
    type: "Car",
    fuel: "Electric",
    price: "₹9.99 L",
    rating: 4.5,
    reviews: 1820,
    range: "421 km",
    top_speed: "140 km/h",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&q=80",
    tag: "Budget",
    tagGradient: "from-green-500 to-emerald-600",
    aiScore: 94,
  },
  {
    id: 103,
    name: "Grand Vitara",
    brand: "Maruti",
    type: "Car",
    fuel: "Hybrid",
    price: "₹13.69 L",
    rating: 4.4,
    reviews: 5430,
    range: "700 km",
    top_speed: "175 km/h",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=700&q=80",
    tag: "Top Value",
    tagGradient: "from-orange-400 to-amber-500",
    aiScore: 91,
  },
  {
    id: 104,
    name: "Himalayan 450",
    brand: "Royal Enfield",
    type: "Bike",
    fuel: "Petrol",
    price: "₹2.85 L",
    rating: 4.6,
    reviews: 2140,
    range: "500 km",
    top_speed: "155 km/h",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
    tag: "Adventure",
    tagGradient: "from-red-500 to-orange-600",
    aiScore: 96,
  },
  {
    id: 105,
    name: "Meteor 350",
    brand: "Royal Enfield",
    type: "Bike",
    fuel: "Petrol",
    price: "₹2.21 L",
    rating: 4.5,
    reviews: 3780,
    range: "520 km",
    top_speed: "130 km/h",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
    tag: "Cruiser",
    tagGradient: "from-purple-500 to-violet-700",
    aiScore: 90,
  },
];

const TRENDING: VehicleCardProps[] = [
  {
    id: 201,
    name: "Swift 2024",
    brand: "Maruti",
    type: "Car",
    fuel: "Petrol",
    price: "₹6.49 L",
    rating: 4.3,
    reviews: 22400,
    range: "600 km",
    top_speed: "170 km/h",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&q=80",
    tag: "🔥 Hot",
    tagGradient: "from-red-500 to-orange-500",
    aiScore: 88,
  },
  {
    id: 202,
    name: "Duke 390",
    brand: "KTM",
    type: "Bike",
    fuel: "Petrol",
    price: "₹3.11 L",
    rating: 4.7,
    reviews: 3200,
    range: "400 km",
    top_speed: "167 km/h",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=700&q=80",
    tag: "Trending",
    tagGradient: "from-orange-400 to-yellow-500",
    aiScore: 95,
  },
  {
    id: 203,
    name: "Creta EV",
    brand: "Hyundai",
    type: "Car",
    fuel: "Electric",
    price: "₹17.99 L",
    rating: 4.5,
    reviews: 1900,
    range: "473 km",
    top_speed: "160 km/h",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80",
    tag: "New Launch",
    tagGradient: "from-cyan-500 to-blue-600",
    aiScore: 93,
  },
  {
    id: 204,
    name: "Activa 7G",
    brand: "Honda",
    type: "Bike",
    fuel: "Petrol",
    price: "₹80,000",
    rating: 4.2,
    reviews: 41000,
    range: "450 km",
    top_speed: "90 km/h",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
    tag: "Bestseller",
    tagGradient: "from-blue-500 to-indigo-600",
    aiScore: 85,
  },
];

const BASED_ON_INTEREST: VehicleCardProps[] = [
  {
    id: 301,
    name: "XUV 3XO",
    brand: "Mahindra",
    type: "Car",
    fuel: "Petrol",
    price: "₹7.49 L",
    rating: 4.4,
    reviews: 4100,
    range: "580 km",
    top_speed: "165 km/h",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&q=80",
    tag: "Compact SUV",
    tagGradient: "from-violet-500 to-purple-700",
    aiScore: 92,
  },
  {
    id: 302,
    name: "Dominar 400",
    brand: "Bajaj",
    type: "Bike",
    fuel: "Petrol",
    price: "₹2.42 L",
    rating: 4.3,
    reviews: 6700,
    range: "420 km",
    top_speed: "148 km/h",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=700&q=80",
    tag: "Sport",
    tagGradient: "from-orange-500 to-red-600",
    aiScore: 89,
  },
  {
    id: 303,
    name: "Altroz EV",
    brand: "Tata",
    type: "Car",
    fuel: "Electric",
    price: "₹9.49 L",
    rating: 4.3,
    reviews: 1400,
    range: "500 km",
    top_speed: "145 km/h",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80",
    tag: "EV Hatch",
    tagGradient: "from-cyan-500 to-teal-600",
    aiScore: 91,
  },
  {
    id: 304,
    name: "CB300R",
    brand: "Honda",
    type: "Bike",
    fuel: "Petrol",
    price: "₹2.88 L",
    rating: 4.5,
    reviews: 2200,
    range: "380 km",
    top_speed: "143 km/h",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
    tag: "Naked",
    tagGradient: "from-red-500 to-rose-600",
    aiScore: 90,
  },
];

/* ─── Tabs Config ───────────────────────────────────────────── */
type TabId = "recommended" | "trending" | "interest";

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ElementType;
  data: VehicleCardProps[];
  accent: string;
}

const TABS: TabConfig[] = [
  {
    id: "recommended",
    label: "Recommended for You",
    icon: Sparkles,
    data: RECOMMENDED,
    accent: "from-cyan-500 to-violet-600",
  },
  {
    id: "trending",
    label: "Trending Now",
    icon: TrendingUp,
    data: TRENDING,
    accent: "from-orange-500 to-red-600",
  },
  {
    id: "interest",
    label: "Based on Your Interest",
    icon: Eye,
    data: BASED_ON_INTEREST,
    accent: "from-violet-500 to-purple-700",
  },
];

/* ─── Skeleton Card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[280px] rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
      {/* Image skeleton */}
      <div className="h-52 skeleton" />
      <div className="p-5 space-y-3">
        {/* Brand */}
        <div className="h-2.5 w-16 skeleton rounded" />
        {/* Name */}
        <div className="h-4 w-40 skeleton rounded" />
        {/* Specs row */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 skeleton rounded-xl" />
          ))}
        </div>
        {/* Price + button */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="h-6 w-24 skeleton rounded" />
          <div className="h-8 w-16 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── RecommendationSection ─────────────────────────────────── */
export default function RecommendationSection() {
  const [activeTab, setActiveTab]   = useState<TabId>("recommended");
  const [isLoading, setIsLoading]   = useState(false);
  const [canScrollL, setCanScrollL] = useState(false);
  const [canScrollR, setCanScrollR] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  /* Simulate loading on tab change */
  const handleTabChange = (id: TabId) => {
    if (id === activeTab) return;
    setIsLoading(true);
    setActiveTab(id);
    setTimeout(() => setIsLoading(false), 900);
  };

  /* Scroll arrow state */
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 10);
    setCanScrollR(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [activeTab]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  return (
    <section id="recommendations" className="relative py-24 overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-[20%] right-[-8%] w-[450px] h-[450px] rounded-full bg-violet-600/7 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-cyan-500/6 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">✦ AI Engine</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight">
              Smart{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Recommendations
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-sm">
              Our AI analyzes 50+ parameters to surface vehicles perfectly matched to you.
            </p>
          </motion.div>

          {/* ── Refresh hint ── */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabChange(activeTab)}
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
              bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs font-medium
              hover:text-white hover:border-cyan-500/25 transition-all duration-200 self-end"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            Refresh Picks
          </motion.button>
        </div>

        {/* ── Tab Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200 ${
                    active
                      ? "text-white shadow-lg"
                      : "text-slate-500 bg-white/[0.03] border border-white/[0.07] hover:text-slate-200 hover:bg-white/[0.06]"
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="recTabBg"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.accent}`}
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "recommended" ? "For You" : tab.id === "trending" ? "Trending" : "Interest"}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Scroll Container ── */}
        <div className="relative">
          {/* Left scroll arrow */}
          <AnimatePresence>
            {canScrollL && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10
                  w-10 h-10 rounded-full bg-[#0D1526]/90 backdrop-blur-md
                  border border-white/[0.12] flex items-center justify-center
                  text-white hover:border-cyan-500/40 hover:text-cyan-400
                  shadow-xl transition-all duration-200 hidden sm:flex"
              >
                <ChevronLeft size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right scroll arrow */}
          <AnimatePresence>
            {canScrollR && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10
                  w-10 h-10 rounded-full bg-[#0D1526]/90 backdrop-blur-md
                  border border-white/[0.12] flex items-center justify-center
                  text-white hover:border-cyan-500/40 hover:text-cyan-400
                  shadow-xl transition-all duration-200 hidden sm:flex"
              >
                <ChevronRight size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── Horizontal Scroll Row ── */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                /* Loading skeletons */
                <motion.div
                  key="skeletons"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-5"
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </motion.div>
              ) : (
                /* Actual cards */
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="flex gap-5"
                >
                  {currentTab.data.map((v, i) => (
                    <div key={v.id} className="flex-shrink-0 w-[280px]">
                      <VehicleCard
                        {...v}
                        index={i}
                        onView={(id) => console.log("View:", id)}
                        onWishlist={(id, s) => console.log("Wishlist:", id, s)}
                        onCart={(id) => console.log("Cart:", id)}
                      />
                    </div>
                  ))}

                  {/* "See All" end card */}
                  <div className="flex-shrink-0 w-[180px] flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-3 p-8 rounded-2xl
                        border border-white/[0.07] bg-white/[0.02]
                        hover:border-cyan-500/25 hover:bg-white/[0.05]
                        text-slate-500 hover:text-cyan-400 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-full border border-white/[0.1] group-hover:border-cyan-500/30 flex items-center justify-center transition-colors">
                        <ChevronRight size={20} />
                      </div>
                      <span className="text-xs font-semibold text-center leading-snug">
                        See All<br />{currentTab.label}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right fade edge */}
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-[#050B18] to-transparent pointer-events-none" />
          {/* Left fade edge */}
          <div className="absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-[#050B18] to-transparent pointer-events-none" />
        </div>

        {/* ── AI Match Info Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-3 justify-center sm:justify-start"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/8 border border-cyan-500/15 text-xs text-cyan-300 font-medium">
            <Sparkles size={12} />
            AI confidence: 94% match accuracy
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.07] text-xs text-slate-500">
            Based on your budget, fuel preference &amp; browsing history
          </div>
        </motion.div>
      </div>
    </section>
  );
}
