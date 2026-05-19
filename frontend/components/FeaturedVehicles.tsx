"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import VehicleCard, { type VehicleCardProps } from "@/components/VehicleCard";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────── */
type Tab = "All" | "Car" | "Bike";

const TABS: Tab[] = ["All", "Car", "Bike"];

/* ─── FeaturedVehicles ──────────────────────────────────────── */
export default function FeaturedVehicles() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [vehicles, setVehicles] = useState<VehicleCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/featured`);
        const data = await res.json();
        if (data.status === 'success') {
          // Transform backend data to match VehicleCardProps format
          const transformedVehicles = data.data.vehicles.map((v: any) => ({
            id: v.id,
            name: v.name,
            brand: v.brand,
            type: v.type,
            fuel: v.fueltype || 'Petrol',
            price: `₹${(v.price / 100000).toFixed(2)} L`,
            rating: v.rating || 4.5,
            reviews: v.reviews || 100,
            range: v.range || '500 km',
            topSpeed: v.top_speed || '150 km/h',
            image: v.image_url || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80',
            tag: v.featured ? 'Featured' : undefined,
            tagGradient: "from-cyan-500 to-blue-600",
            aiScore: v.ai_score || 90,
          }));
          setVehicles(transformedVehicles);
        }
      } catch (error) {
        console.error("Failed to fetch featured vehicles", error);
        // Fallback to empty array if API fails
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filtered =
    activeTab === "All" ? vehicles : vehicles.filter((v) => v.type === activeTab);

  return (
    <section id="featured" className="relative py-24 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-[30%] left-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-500/6 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-violet-600/8 blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
              ✦ Top Picks
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight">
              Featured{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Vehicles
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">
              Handpicked by our AI based on popularity, ratings &amp; value.
            </p>
          </motion.div>

          {/* ── Tab Filter with spring animation ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex gap-1.5 p-1.5 bg-white/[0.03] border border-white/[0.07] rounded-xl"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="featuredTabBg"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tab === "Car" ? "🚗 Cars" : tab === "Bike" ? "🏍️ Bikes" : "All"}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── Cards Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-white/[0.02] border border-white/[0.06] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No featured vehicles available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((v, i) => (
              <Link key={v.id} href={`/vehicles/${v.id}`}>
                <VehicleCard
                  {...v}
                  index={i}
                  onView={(id) => console.log("View vehicle:", id)}
                  onWishlist={(id, state) => console.log("Wishlist:", id, state)}
                  onCart={(id) => console.log("Cart:", id)}
                />
              </Link>
            ))}
          </div>
        )}

        {/* ── View All ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
              bg-white/[0.04] border border-white/[0.1] text-sm font-semibold text-slate-300
              hover:bg-white/[0.08] hover:border-cyan-500/25 hover:text-white
              transition-all duration-200"
          >
            View All Vehicles
            <ArrowRight size={15} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
