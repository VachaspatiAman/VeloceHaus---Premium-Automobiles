"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompare, Plus, X, Check, Star, ChevronDown, ChevronUp, Zap,
  Fuel, Gauge, MapPin, Cog, Weight, Users, ShoppingCart, Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { VEHICLES, type Vehicle } from "@/lib/vehicles-data";

/* ─── Types ─────────────────────────────────────────────────── */
const MAX_COMPARE = 3;

/* ─── Vehicle Picker Modal ───────────────────────────────────── */
function VehiclePicker({
  onSelect,
  onClose,
  excluded,
}: {
  onSelect: (v: Vehicle) => void;
  onClose: () => void;
  excluded: number[];
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Car" | "Bike">("All");

  const filtered = VEHICLES.filter(
    (v) =>
      !excluded.includes(v.id) &&
      (typeFilter === "All" || v.type === typeFilter) &&
      `${v.brand} ${v.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0A1628] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.07]">
          <h3 className="font-display font-bold text-white text-lg">Select a Vehicle</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search + Type filter */}
        <div className="p-4 space-y-3 border-b border-white/[0.07]">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
            autoFocus
          />
          <div className="flex gap-2">
            {(["All", "Car", "Bike"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  typeFilter === t
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white"
                    : "bg-white/[0.05] text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle list */}
        <div className="overflow-y-auto max-h-80 p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No vehicles found</div>
          ) : (
            filtered.map((v) => (
              <button
                key={v.id}
                onClick={() => { onSelect(v); onClose(); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-cyan-500/20 transition-all text-left group"
              >
                <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={v.image} alt={v.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{v.brand}</div>
                  <div className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                    {v.name}
                  </div>
                  <div className="text-xs text-slate-500">{v.fuel} · {v.price}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  {v.rating}
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Compare Column ─────────────────────────────────────────── */
function CompareColumn({
  vehicle,
  onRemove,
  bestValue,
}: {
  vehicle: Vehicle;
  onRemove: () => void;
  bestValue: Record<string, number | string>;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const [carted, setCarted] = useState(false);

  const isBest = (key: string, val?: string | number) => {
    if (!val) return false;
    return String(bestValue[key]) === String(val);
  };

  return (
    <div className="flex flex-col min-w-[240px]">
      {/* Image + Remove */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] mb-4 group">
        <Image
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.name}`}
          width={400}
          height={220}
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500/50 transition-all"
        >
          <X size={13} />
        </button>
        {vehicle.tag && (
          <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${vehicle.tagGradient} text-white`}>
            {vehicle.tag}
          </span>
        )}
      </div>

      {/* Name */}
      <div className="mb-3">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{vehicle.brand}</div>
        <Link href={`/vehicles/${vehicle.id}`}>
          <h3 className="font-display font-bold text-white text-base hover:text-cyan-400 transition-colors">
            {vehicle.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">{vehicle.rating}</span>
          <span className="text-[10px] text-slate-500">({vehicle.reviews.toLocaleString()})</span>
        </div>
      </div>

      {/* Price */}
      <div className={`text-xl font-black font-display mb-4 ${
        isBest("price", vehicle.priceNum)
          ? "bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
          : "bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent"
      }`}>
        {vehicle.price}
        {isBest("price", vehicle.priceNum) && (
          <span className="text-[10px] font-bold text-green-400 ml-2 bg-green-500/15 px-2 py-0.5 rounded-full">Best Price</span>
        )}
      </div>

      {/* Spec cells — matches the row order in CompareTable */}
      {[
        { val: vehicle.range,          key: "range"       },
        { val: vehicle.topSpeed,        key: "topSpeed"    },
        { val: vehicle.acceleration,   key: "accel"       },
        { val: vehicle.power,          key: "power"       },
        { val: vehicle.torque,         key: "torque"      },
        { val: vehicle.fuel,           key: "fuel"        },
        { val: vehicle.transmission,   key: "trans"       },
        { val: vehicle.seating ? `${vehicle.seating} Seats` : undefined, key: "seating" },
        { val: vehicle.weight,         key: "weight"      },
        { val: `${vehicle.aiScore}%`,  key: "ai"          },
      ].map(({ val, key }) => (
        <div
          key={key}
          className={`py-3 px-3 border-b border-white/[0.05] text-sm rounded-lg mb-0.5 ${
            isBest(key, val)
              ? "bg-green-500/8 border-green-500/15 text-green-300 font-semibold"
              : "text-slate-300"
          }`}
        >
          {val ?? <span className="text-slate-600">—</span>}
          {isBest(key, val) && <Check size={12} className="inline ml-1.5 text-green-400" />}
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setCarted(true); setTimeout(() => setCarted(false), 2000); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            carted
              ? "bg-green-500/20 border border-green-500/30 text-green-400"
              : "bg-gradient-to-r from-cyan-500 to-violet-600 text-white"
          }`}
        >
          <ShoppingCart size={13} />
          {carted ? "Added!" : "Add to Cart"}
        </motion.button>
        <button
          onClick={() => setWishlisted((v) => !v)}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
            wishlisted ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-white/[0.04] border-white/[0.08] text-slate-400"
          }`}
        >
          <Heart size={13} className={wishlisted ? "fill-red-400" : ""} />
        </button>
      </div>
    </div>
  );
}

/* ─── Spec Row Label ─────────────────────────────────────────── */
const SPEC_ROWS = [
  { label: "Range",        icon: MapPin  },
  { label: "Top Speed",    icon: Gauge   },
  { label: "0–100 km/h",   icon: Zap     },
  { label: "Power",        icon: Cog     },
  { label: "Torque",       icon: Cog     },
  { label: "Fuel Type",    icon: Fuel    },
  { label: "Transmission", icon: Cog     },
  { label: "Seating",      icon: Users   },
  { label: "Kerb Weight",  icon: Weight  },
  { label: "AI Score",     icon: Zap     },
];

/* ─── Compare Page ───────────────────────────────────────────── */
export default function ComparePage() {
  const [selected, setSelected] = useState<Vehicle[]>([VEHICLES[0], VEHICLES[6]]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const addVehicle = (v: Vehicle) => setSelected((prev) => [...prev, v]);
  const removeVehicle = (id: number) => setSelected((prev) => prev.filter((v) => v.id !== id));

  /* Determine best value per spec for green highlight */
  const bestValue: Record<string, number | string> = {};
  if (selected.length > 1) {
    const parseNum = (s?: string) => parseFloat((s ?? "0").replace(/[^\d.]/g, ""));
    bestValue.price    = Math.min(...selected.map((v) => v.priceNum));
    bestValue.range    = `${Math.max(...selected.map((v) => parseNum(v.range)))} km`;
    bestValue.topSpeed = `${Math.max(...selected.map((v) => parseNum(v.topSpeed)))} km/h`;
    bestValue.accel    = selected.reduce((a, b) => parseNum(a.acceleration) < parseNum(b.acceleration) ? a : b).acceleration ?? "";
    bestValue.power    = `${Math.max(...selected.map((v) => parseNum(v.power)))} bhp`;
    bestValue.ai       = `${Math.max(...selected.map((v) => v.aiScore ?? 0))}%`;
  }

  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />

      <AnimatePresence>
        {pickerOpen && (
          <VehiclePicker
            onSelect={addVehicle}
            onClose={() => setPickerOpen(false)}
            excluded={selected.map((v) => v.id)}
          />
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <div className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[250px] bg-violet-500/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-cyan-400 text-xs font-bold">
              <GitCompare size={13} />
              Side-by-Side Comparison
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
              Compare{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Vehicles
              </span>
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Add up to 3 vehicles and compare their specs, features, and pricing side by side.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ── Compare Grid ── */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: `180px repeat(${selected.length + (selected.length < MAX_COMPARE ? 1 : 0)}, minmax(240px,1fr))` }}
            >

              {/* Spec Labels Column */}
              <div className="flex flex-col">
                <div className="h-44 mb-4" />   {/* image placeholder height */}
                <div className="mb-3 h-[5rem]" /> {/* name height */}
                <div className="mb-4 h-8" />      {/* price height */}

                {SPEC_ROWS.map(({ label, icon: Icon }) => (
                  <div key={label} className="py-3 px-2 border-b border-white/[0.05] flex items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
                    <Icon size={12} className="text-slate-600 flex-shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Vehicle Columns */}
              {selected.map((v) => (
                <CompareColumn
                  key={v.id}
                  vehicle={v}
                  onRemove={() => removeVehicle(v.id)}
                  bestValue={bestValue}
                />
              ))}

              {/* Add Vehicle Slot */}
              {selected.length < MAX_COMPARE && (
                <div className="flex flex-col">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPickerOpen(true)}
                    className="h-44 rounded-2xl border-2 border-dashed border-white/[0.12] flex flex-col items-center justify-center gap-3
                      text-slate-600 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300 mb-4 group"
                  >
                    <div className="w-10 h-10 rounded-full border border-white/[0.12] group-hover:border-cyan-500/30 flex items-center justify-center transition-colors">
                      <Plus size={20} />
                    </div>
                    <span className="text-xs font-semibold">Add Vehicle</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Verdict Banner ── */}
        {selected.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 to-violet-600/8 text-center"
          >
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold mb-3">
              <Zap size={13} fill="currentColor" />
              AI Verdict
            </div>
            <p className="text-white text-sm">
              Based on specs and AI scores,{" "}
              <span className="font-bold text-cyan-400">
                {selected.reduce((a, b) => (a.aiScore ?? 0) > (b.aiScore ?? 0) ? a : b).brand}{" "}
                {selected.reduce((a, b) => (a.aiScore ?? 0) > (b.aiScore ?? 0) ? a : b).name}
              </span>{" "}
              scores highest with an AI match of{" "}
              <span className="font-bold text-cyan-400">
                {Math.max(...selected.map((v) => v.aiScore ?? 0))}%
              </span>
              .
            </p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
