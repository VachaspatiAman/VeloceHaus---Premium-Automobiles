"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Heart, ShoppingCart, Zap, ArrowLeft, Fuel, Gauge, MapPin,
  Cog, Weight, Users, Sparkles, CheckCircle2, Share2, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import VehicleShowcase from "@/components/VehicleShowcase";
import { VEHICLES } from "@/lib/vehicles-data";

/* ─── Mock Reviews ───────────────────────────────────────────── */
const MOCK_REVIEWS = [
  { id: 1, name: "Arjun Mehta",     avatar: "AM", rating: 5, date: "Jan 2025", comment: "Absolutely love this vehicle! The performance is top-notch and fuel efficiency is better than expected. Build quality feels premium." },
  { id: 2, name: "Priya Sharma",    avatar: "PS", rating: 4, date: "Feb 2025", comment: "Great buy overall. The features are excellent for the price. Infotainment could be slightly more responsive but everything else is fantastic." },
  { id: 3, name: "Rahul Verma",     avatar: "RV", rating: 5, date: "Mar 2025", comment: "Best purchase of 2024! Smooth ride, excellent mileage, and the connected car tech is very intuitive. Highly recommend to anyone in the market." },
];

/* ─── Star Rating Display ────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13}
          className={
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i < rating
              ? "text-yellow-400 fill-yellow-400/50"
              : "text-slate-700"
          }
        />
      ))}
    </div>
  );
}

/* ─── Spec Row ────────────────────────────────────────────────── */
function SpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-none">
      <div className="flex items-center gap-2.5 text-slate-400 text-sm">
        <Icon size={15} className="text-cyan-400 flex-shrink-0" />
        {label}
      </div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

/* ─── Tab Content ─────────────────────────────────────────────── */
type TabId = "overview" | "specs" | "reviews";

function OverviewTab({ vehicle }: { vehicle: (typeof VEHICLES)[0] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Description */}
      <div>
        <h3 className="font-display font-bold text-white text-lg mb-3">About this Vehicle</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{vehicle.description}</p>
      </div>

      {/* Key specs quick view */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { Icon: MapPin,  val: vehicle.range,    lbl: "Range"      },
          { Icon: Gauge,   val: vehicle.topSpeed,  lbl: "Top Speed"  },
          { Icon: Zap,     val: vehicle.acceleration, lbl: "0–100"   },
          { Icon: Cog,     val: vehicle.power,    lbl: "Power"      },
          { Icon: Fuel,    val: vehicle.fuel,     lbl: "Fuel Type"  },
          { Icon: Users,   val: vehicle.seating ? `${vehicle.seating} Seats` : undefined, lbl: "Seating" },
        ].filter(s => s.val).map(({ Icon, val, lbl }) => (
          <div key={lbl} className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 text-center hover:border-cyan-500/20 transition-colors">
            <Icon size={16} className="text-cyan-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-white">{val}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      {vehicle.features && (
        <div>
          <h3 className="font-display font-bold text-white text-lg mb-4">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vehicle.features.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {vehicle.colors && (
        <div>
          <h3 className="font-display font-bold text-white text-lg mb-4">Available Colors</h3>
          <div className="flex flex-wrap gap-2">
            {vehicle.colors.map((c) => (
              <div key={c} className="px-3 py-1.5 rounded-full text-xs text-slate-300 bg-white/[0.05] border border-white/[0.09] hover:border-cyan-500/30 transition-colors cursor-pointer">
                {c}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SpecsTab({ vehicle }: { vehicle: (typeof VEHICLES)[0] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <h3 className="font-display font-bold text-white text-lg mb-4">Full Specifications</h3>
        <SpecRow icon={Cog}    label="Engine / Motor" value={vehicle.engine} />
        <SpecRow icon={Zap}    label="Power Output"   value={vehicle.power} />
        <SpecRow icon={Gauge}  label="Torque"         value={vehicle.torque} />
        <SpecRow icon={Gauge}  label="Top Speed"      value={vehicle.topSpeed} />
        <SpecRow icon={Zap}    label="0–100 km/h"     value={vehicle.acceleration} />
        <SpecRow icon={MapPin} label="Range"          value={vehicle.range} />
        <SpecRow icon={Cog}    label="Transmission"   value={vehicle.transmission} />
        <SpecRow icon={Fuel}   label="Fuel Type"      value={vehicle.fuel} />
        <SpecRow icon={Users}  label="Seating"        value={vehicle.seating ? `${vehicle.seating} Persons` : undefined} />
        <SpecRow icon={Weight} label="Kerb Weight"    value={vehicle.weight} />
      </div>
    </motion.div>
  );
}

function ReviewsTab({ vehicle }: { vehicle: (typeof VEHICLES)[0] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Rating summary */}
      <div className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
        <div className="text-center">
          <div className="font-display font-black text-5xl text-white">{vehicle.rating}</div>
          <Stars rating={vehicle.rating} />
          <div className="text-xs text-slate-500 mt-1">{vehicle.reviews.toLocaleString()} reviews</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5,4,3,2,1].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-2">{n}</span>
              <Star size={10} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
              <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  style={{ width: n === 5 ? "60%" : n === 4 ? "25%" : n === 3 ? "10%" : "3%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      {MOCK_REVIEWS.map((r) => (
        <div key={r.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07]">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {r.avatar}
            </div>
            <div>
              <div className="font-semibold text-sm text-white">{r.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <Stars rating={r.rating} />
                <span className="text-[10px] text-slate-500">{r.date}</span>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{r.comment}</p>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Detail Page ─────────────────────────────────────────────── */
export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/vehicles/${params.id}`);
        const data = await res.json();
        if (data.status === 'success' && data.data.vehicle) {
          const v = data.data.vehicle;
          setVehicle({
            id: v.id,
            name: v.name,
            brand: v.brand,
            type: v.type || "Car",
            fuel: v.fueltype || 'Petrol',
            price: `₹${(v.price / 100000).toFixed(2)} L`,
            priceNum: v.price,
            rating: v.rating || 4.5,
            reviews: v.reviews || 100,
            range: v.range || '500 km',
            topSpeed: v.top_speed || '150 km/h',
            image: v.image_url || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80',
            description: v.description || 'No description available.',
            colors: ['Stealth Black', 'Arctic White']
          });
        } else {
          const staticV = VEHICLES.find((v) => v.id.toString() === params.id);
          if (staticV) setVehicle(staticV);
          else setError(true);
        }
      } catch (err) {
        const staticV = VEHICLES.find((v) => v.id.toString() === params.id);
        if (staticV) setVehicle(staticV);
        else setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [params.id]);

  const [activeTab,   setActiveTab]   = useState<TabId>("overview");
  const [wishlisted,  setWishlisted]  = useState(false);
  const [cartAdded,   setCartAdded]   = useState(false);

  if (loading) {
    return <div className="min-h-screen bg-[#050B18] flex items-center justify-center text-cyan-400">Loading vehicle details...</div>;
  }
  if (error || !vehicle) {
    notFound();
  }

  const similar = VEHICLES
    .filter((v) => v.id.toString() !== vehicle.id.toString() && v.type === vehicle.type)
    .slice(0, 3);

  const handleCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2500);
  };

  const TABS: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "specs",    label: "Specs"    },
    { id: "reviews",  label: "Reviews"  },
  ];

  /* ── Map vehicle data to ShowcaseVehicle shape ── */
  const showcaseData = {
    name:         vehicle.name,
    brand:        vehicle.brand,
    model:        `${vehicle.type} · ${vehicle.fuel}`,
    image:        vehicle.image,
    price:        vehicle.priceNum,
    speed:        vehicle.topSpeed,
    acceleration: vehicle.acceleration ?? "N/A",
    transmission: vehicle.transmission ?? "N/A",
    description:  vehicle.description,
    rating:       vehicle.rating,
    colors: vehicle.colors?.map((c: string) => ({ label: c, hex: "#1a2a3a" })),
    wheels: ["Standard Alloy", `Sport ${vehicle.type === "Car" ? "18\"" : "17\""}`, "Performance Edition"],
  };

  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />

      {/* ══ CINEMATIC SHOWCASE  ══ */}
      <VehicleShowcase
        vehicle={showcaseData}
        onBack={() => window.history.back()}
        onCart={handleCart}
        onWishlist={() => setWishlisted((v) => !v)}
      />

      {/* ══ DETAIL CONTENT below the showcase ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-12">

        {/* ── Tabs ── */}
        <div className="mb-8">
          <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.07] rounded-xl w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="detailTab"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/80 to-violet-600/80"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tab.label}
                {tab.id === "reviews" && (
                  <span className="ml-1.5 text-[10px] text-slate-500">({vehicle.reviews.toLocaleString()})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <div key={activeTab} className="mb-16">
            {activeTab === "overview" && <OverviewTab vehicle={vehicle} />}
            {activeTab === "specs"    && <SpecsTab    vehicle={vehicle} />}
            {activeTab === "reviews"  && <ReviewsTab  vehicle={vehicle} />}
          </div>
        </AnimatePresence>

        {/* ── Similar Vehicles ── */}
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-8">
            Similar{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Vehicles
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((v, i) => (
              <Link key={v.id} href={`/vehicles/${v.id}`} className="block">
                <VehicleCard {...v} index={i} onView={(id) => console.log("View:", id)} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
