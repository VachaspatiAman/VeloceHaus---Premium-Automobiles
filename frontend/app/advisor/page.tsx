"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Car, Bike, Zap, Fuel, MapPin, Gauge, Check, ChevronRight,
  ChevronLeft, RotateCcw, Star, ShoppingCart, Heart, ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { VEHICLES, type Vehicle } from "@/lib/vehicles-data";

/* ─── Scoring Engine ─────────────────────────────────────────── */
interface Prefs {
  budgetMax:   number;          // priceNum upper limit
  type:        "Car" | "Bike" | "Any";
  fuel:        string[];        // fuel types
  usage:       "City" | "Highway" | "Off-road" | "Any";
  brands:      string[];        // empty = any
}

function scoreVehicle(v: Vehicle, prefs: Prefs): number {
  let score = 0;

  // Budget match (40 pts)
  if (v.priceNum <= prefs.budgetMax) {
    score += 40 * (1 - v.priceNum / prefs.budgetMax * 0.3);
  }

  // Type match (20 pts)
  if (prefs.type === "Any" || v.type === prefs.type) score += 20;

  // Fuel preference (15 pts)
  if (prefs.fuel.length === 0 || prefs.fuel.includes(v.fuel)) score += 15;

  // Usage match (15 pts via fuel heuristic)
  if (prefs.usage === "City" && (v.fuel === "Electric" || v.fuel === "Hybrid")) score += 15;
  else if (prefs.usage === "Highway" && v.priceNum > 1000000) score += 12;
  else if (prefs.usage === "Off-road" && v.type === "Bike") score += 14;
  else if (prefs.usage === "Any") score += 10;
  else score += 6;

  // Brand preference (5 pts)
  if (prefs.brands.length === 0 || prefs.brands.includes(v.brand)) score += 5;

  // Popularity boost (5 pts)
  score += Math.min(5, v.reviews / 5000);

  return Math.round(Math.min(100, score));
}

/* ─── Step components ───────────────────────────────────────── */

/* Step 1: Budget */
const BUDGETS = [
  { label: "Under ₹3L",  max: 300000  },
  { label: "₹3L – ₹8L", max: 800000  },
  { label: "₹8L – ₹15L",max: 1500000 },
  { label: "₹15L – ₹25L",max:2500000 },
  { label: "₹25L+",     max: 9999999 },
];

function StepBudget({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {BUDGETS.map((b) => (
        <motion.button
          key={b.max}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(b.max)}
          className={`relative p-4 rounded-2xl border text-sm font-semibold text-left transition-all ${
            value === b.max
              ? "border-cyan-500/50 bg-cyan-500/10 text-white"
              : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
          }`}
        >
          {value === b.max && (
            <motion.div
              layoutId="budgetSelected"
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-violet-600/10"
            />
          )}
          <span className="relative z-10 text-base font-bold">{b.label}</span>
          {value === b.max && <Check size={14} className="absolute top-3 right-3 text-cyan-400" />}
        </motion.button>
      ))}
    </div>
  );
}

/* Step 2: Vehicle Type */
function StepType({ value, onChange }: { value: string; onChange: (v: "Car" | "Bike" | "Any") => void }) {
  const types = [
    { id: "Car" as const,  icon: Car,  label: "Car",       sub: "Sedans, SUVs, Hatchbacks" },
    { id: "Bike" as const, icon: Bike, label: "Bike",      sub: "Cruisers, Sports, Adventure" },
    { id: "Any" as const,  icon: Zap,  label: "Surprise Me",sub: "Let AI decide for you" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {types.map(({ id, icon: Icon, label, sub }) => (
        <motion.button
          key={id}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(id)}
          className={`flex flex-col items-center gap-4 p-8 rounded-2xl border transition-all ${
            value === id
              ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/12 to-violet-600/8 text-white"
              : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            value === id ? "bg-gradient-to-br from-cyan-500 to-violet-600" : "bg-white/[0.07]"
          }`}>
            <Icon size={26} className="text-white" />
          </div>
          <div className="text-center">
            <div className="font-bold text-base">{label}</div>
            <div className="text-xs text-slate-500 mt-1">{sub}</div>
          </div>
          {value === id && <Check size={14} className="text-cyan-400" />}
        </motion.button>
      ))}
    </div>
  );
}

/* Step 3: Fuel */
const FUELS = [
  { id: "Electric", emoji: "⚡", sub: "Zero emissions, low running cost" },
  { id: "Petrol",   emoji: "🔴", sub: "Wide availability, smooth performance" },
  { id: "Diesel",   emoji: "🟡", sub: "Best mileage for long highway runs" },
  { id: "Hybrid",   emoji: "🌿", sub: "Best of both worlds" },
];
function StepFuel({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((f) => f !== id) : [...value, id]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {FUELS.map(({ id, emoji, sub }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toggle(id)}
          className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${
            value.includes(id)
              ? "border-cyan-500/50 bg-cyan-500/10 text-white"
              : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20"
          }`}
        >
          <span className="text-2xl">{emoji}</span>
          <div className="flex-1">
            <div className="font-bold">{id}</div>
            <div className="text-xs text-slate-500">{sub}</div>
          </div>
          {value.includes(id) && <Check size={14} className="text-cyan-400 flex-shrink-0" />}
        </motion.button>
      ))}
      <p className="col-span-full text-xs text-slate-600 text-center">Select all that apply · skip to show all fuel types</p>
    </div>
  );
}

/* Step 4: Usage */
const USAGES = [
  { id: "City"     as const, emoji: "🏙️", label: "City Commuting",  sub: "Daily office, traffic, short trips" },
  { id: "Highway"  as const, emoji: "🛣️", label: "Highway Touring",  sub: "Long distance, interstate travel" },
  { id: "Off-road" as const, emoji: "🏔️", label: "Off-road / ADV",  sub: "Trails, mountains, adventure" },
  { id: "Any"      as const, emoji: "🌐", label: "Mixed / All-round", sub: "Versatile, used for everything" },
];
function StepUsage({ value, onChange }: { value: string; onChange: (v: "City" | "Highway" | "Off-road" | "Any") => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {USAGES.map(({ id, emoji, label, sub }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(id)}
          className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
            value === id
              ? "border-cyan-500/50 bg-cyan-500/10 text-white"
              : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20"
          }`}
        >
          <span className="text-2xl">{emoji}</span>
          <div className="flex-1">
            <div className="font-bold">{label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
          </div>
          {value === id && <Check size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />}
        </motion.button>
      ))}
    </div>
  );
}

/* Step 5: Brand */
import { BRANDS } from "@/lib/vehicles-data";
function StepBrand({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (b: string) =>
    onChange(value.includes(b) ? value.filter((x) => x !== b) : [...value, b]);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {BRANDS.map((b) => (
          <motion.button
            key={b}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggle(b)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              value.includes(b)
                ? "bg-gradient-to-r from-cyan-500 to-violet-600 border-transparent text-white"
                : "border-white/[0.1] bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            {b}
          </motion.button>
        ))}
      </div>
      <p className="text-xs text-slate-600">Skip to include all brands · select multiple for wider results</p>
    </div>
  );
}

/* ─── Result Card ────────────────────────────────────────────── */
function ResultCard({ v, score, rank }: { v: Vehicle; score: number; rank: number }) {
  const [carted, setCarted] = useState(false);
  const [wished, setWished] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.5 }}
      className={`relative rounded-2xl overflow-hidden border transition-all duration-500
        ${rank === 0
          ? "border-cyan-500/40 shadow-xl shadow-cyan-500/10"
          : "border-white/[0.07] hover:border-cyan-500/25"
        } bg-white/[0.03]`}
    >
      {rank === 0 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500" />
      )}
      {rank === 0 && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-[10px] font-bold text-white">
          <Sparkles size={10} />
          Best Match
        </div>
      )}

      <div className="relative h-44 overflow-hidden">
        <Image src={v.image} alt={v.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-transparent to-transparent" />
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-cyan-500/30 text-xs font-bold text-cyan-300">
          <Zap size={10} fill="currentColor" />
          AI: {score}%
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{v.brand}</p>
            <h3 className="font-display font-bold text-white text-lg">{v.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-white">{v.rating}</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Match Score</span><span className="text-cyan-400 font-bold">{score}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, delay: rank * 0.1 + 0.3 }}
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
            />
          </div>
        </div>

        {/* Mini specs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { Icon: MapPin, val: v.range,    sub: "Range"  },
            { Icon: Gauge,  val: v.topSpeed,  sub: "Speed"  },
            { Icon: Fuel,   val: v.fuel,     sub: "Fuel"   },
          ].map(({ Icon, val, sub }) => (
            <div key={sub} className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-2 text-center">
              <Icon size={11} className="text-cyan-400 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-white leading-none">{val}</div>
              <div className="text-[9px] text-slate-500">{sub}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div>
            <div className="text-[10px] text-slate-500">Starting from</div>
            <div className="font-display font-black text-lg bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {v.price}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWished((w) => !w)}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                wished ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-white/[0.05] border-white/[0.08] text-slate-400"
              }`}
            >
              <Heart size={12} className={wished ? "fill-red-400" : ""} />
            </button>
            <button
              onClick={() => { setCarted(true); setTimeout(() => setCarted(false), 2000); }}
              className={`px-3 h-8 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
                carted
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:border-cyan-500/30"
              }`}
            >
              <ShoppingCart size={11} />
              {carted ? "Added!" : "Cart"}
            </button>
            <Link href={`/vehicles/${v.id}`}
              className="px-3 h-8 rounded-lg flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 text-white"
            >
              View
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Advisor Page ───────────────────────────────────────────── */
const STEPS = [
  { id: 1, title: "What's your budget?",     sub: "Find the range that works for you" },
  { id: 2, title: "Car or Bike?",             sub: "Choose your vehicle category"      },
  { id: 3, title: "Fuel preference?",         sub: "Select one or multiple"            },
  { id: 4, title: "How will you use it?",    sub: "This helps us match the right fit" },
  { id: 5, title: "Any brand preference?",   sub: "Skip if you're open to anything"   },
];

export default function AdvisorPage() {
  const [step,    setStep]    = useState(1);
  const [results, setResults] = useState<{ vehicle: Vehicle; score: number }[] | null>(null);

  const [prefs, setPrefs] = useState<Prefs>({
    budgetMax: 1500000,
    type: "Any",
    fuel: [],
    usage: "Any",
    brands: [],
  });

  const currentStep = STEPS[step - 1];
  const progress = ((step - 1) / (STEPS.length)) * 100;

  const canNext  = step === 1 ? true : step === 2 ? !!prefs.type : true;
  const isLast   = step === STEPS.length;

  const handleNext = () => {
    if (isLast) {
      const scored = VEHICLES
        .map((v) => ({ vehicle: v, score: scoreVehicle(v, prefs) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      setResults(scored);
    } else {
      setStep((s) => s + 1);
    }
  };

  const reset = () => {
    setResults(null);
    setStep(1);
    setPrefs({ budgetMax: 1500000, type: "Any", fuel: [], usage: "Any", brands: [] });
  };

  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-violet-600/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-cyan-500/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-cyan-500/20 text-cyan-400 text-xs font-bold">
              <Sparkles size={13} />
              AI-Powered Vehicle Advisor
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-white mb-4">
              Find Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Answer 5 quick questions and our AI will recommend the best vehicles tailored to you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="wizard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* ── Progress bar ── */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Step {step} of {STEPS.length}</span>
                  <span>{Math.round(progress + 20)}% complete</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress + 20}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                  />
                </div>

                {/* Step dots */}
                <div className="flex justify-center gap-3 mt-4">
                  {STEPS.map((s) => (
                    <div key={s.id}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        s.id < step ? "bg-cyan-400" : s.id === step ? "bg-violet-500 scale-125" : "bg-white/[0.12]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* ── Step Card ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 mb-6"
                >
                  <h2 className="font-display font-black text-2xl text-white mb-1">{currentStep.title}</h2>
                  <p className="text-slate-500 text-sm mb-7">{currentStep.sub}</p>

                  {step === 1 && <StepBudget value={prefs.budgetMax} onChange={(v) => setPrefs((p) => ({ ...p, budgetMax: v }))} />}
                  {step === 2 && <StepType   value={prefs.type}      onChange={(v) => setPrefs((p) => ({ ...p, type: v }))} />}
                  {step === 3 && <StepFuel   value={prefs.fuel}      onChange={(v) => setPrefs((p) => ({ ...p, fuel: v }))} />}
                  {step === 4 && <StepUsage  value={prefs.usage}     onChange={(v) => setPrefs((p) => ({ ...p, usage: v }))} />}
                  {step === 5 && <StepBrand  value={prefs.brands}    onChange={(v) => setPrefs((p) => ({ ...p, brands: v }))} />}
                </motion.div>
              </AnimatePresence>

              {/* ── Navigation ── */}
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 text-sm font-semibold hover:bg-white/[0.08] transition-all"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,212,255,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  disabled={!canNext}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl
                    bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm
                    shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                  {isLast ? (
                    <>
                      <Sparkles size={16} />
                      Find My Vehicle
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight size={16} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ── Results ── */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30"
                >
                  <Sparkles size={28} className="text-white" />
                </motion.div>
                <h2 className="font-display font-black text-3xl text-white mb-2">
                  Your Top Matches
                </h2>
                <p className="text-slate-500 text-sm">
                  Based on your preferences, here are the vehicles our AI recommends.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                {results.map(({ vehicle, score }, i) => (
                  <ResultCard key={vehicle.id} v={vehicle} score={score} rank={i} />
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-300 text-sm font-semibold hover:bg-white/[0.08] transition-all"
                >
                  <RotateCcw size={15} />
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
