"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, Search, ChevronDown, X, LayoutGrid, List, ArrowUpDown
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { VEHICLES, BRANDS, FUEL_TYPES, type FuelType, type VehicleType } from "@/lib/vehicles-data";
import Link from "next/link";

/* ─── Price Range Slider ─────────────────────────────────────── */
function PriceSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-slate-400">
        <span>₹0</span>
        <span className="font-semibold text-cyan-400">Up to ₹{(value / 100000).toFixed(1)}L</span>
        <span>₹30L</span>
      </div>
      <div className="relative h-1 bg-white/10 rounded-full">
        <div
          className="absolute h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full"
          style={{ width: `${(value / 3000000) * 100}%` }}
        />
      </div>
      <input
        type="range" min={500000} max={3000000} step={50000} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-500 h-1 appearance-none bg-transparent cursor-pointer"
      />
    </div>
  );
}

/* ─── Filter Section ─────────────────────────────────────────── */
function FilterSection({
  title, children, defaultOpen = false,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.07] pb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
      >
        {title}
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="py-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sidebar Filters ────────────────────────────────────────── */
function SidebarFilters({
  selectedType, setSelectedType,
  selectedFuels, toggleFuel,
  selectedBrands, toggleBrand,
  maxPrice, setMaxPrice,
  resetFilters,
}: {
  selectedType: "All" | VehicleType;
  setSelectedType: (v: "All" | VehicleType) => void;
  selectedFuels: FuelType[];
  toggleFuel: (f: FuelType) => void;
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  resetFilters: () => void;
}) {
  const types: ("All" | VehicleType)[] = ["All", "Car", "Bike"];

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-cyan-400" />
            <span className="text-sm font-bold text-white">Filters</span>
          </div>
          <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
            Reset All
          </button>
        </div>

        {/* Vehicle Type */}
        <FilterSection title="Vehicle Type" defaultOpen>
          <div className="grid grid-cols-3 gap-1.5">
            {types.map((t) => (
              <button key={t} onClick={() => setSelectedType(t)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === t
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white"
                    : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.07]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Max Price" defaultOpen>
          <PriceSlider value={maxPrice} onChange={setMaxPrice} />
        </FilterSection>

        {/* Fuel Type */}
        <FilterSection title="Fuel Type" defaultOpen>
          <div className="space-y-2">
            {FUEL_TYPES.map((fuel) => (
              <label key={fuel} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => toggleFuel(fuel)}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    selectedFuels.includes(fuel)
                      ? "bg-gradient-to-br from-cyan-500 to-violet-600 border-transparent"
                      : "border-white/20 group-hover:border-cyan-500/40"
                  }`}
                >
                  {selectedFuels.includes(fuel) && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{fuel}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brand */}
        <FilterSection title="Brand">
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {BRANDS.map((brand) => (
              <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => toggleBrand(brand)}
                  className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                    selectedBrands.includes(brand)
                      ? "bg-gradient-to-br from-cyan-500 to-violet-600 border-transparent"
                      : "border-white/20 group-hover:border-cyan-500/40"
                  }`}
                >
                  {selectedBrands.includes(brand) && <span className="text-white text-[10px]">✓</span>}
                </div>
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors truncate">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
      <div className="h-48 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-5 w-36 skeleton rounded" />
        <div className="grid grid-cols-3 gap-2">
          {[0,1,2].map(i => <div key={i} className="h-12 skeleton rounded-xl" />)}
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-6 w-24 skeleton rounded" />
          <div className="h-8 w-16 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Listing Page ──────────────────────────────────────── */
function VehiclesContent() {
  const searchParams = useSearchParams();
  const typeParam = (searchParams.get("type") ?? "All") as "All" | VehicleType;

  const [selectedType,   setSelectedType]   = useState<"All" | VehicleType>(typeParam);
  const [selectedFuels,  setSelectedFuels]  = useState<FuelType[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice,       setMaxPrice]       = useState(3000000);
  const [sortBy,         setSortBy]         = useState<"rating" | "price_asc" | "price_desc" | "reviews">("rating");
  const [search,         setSearch]         = useState("");
  const [viewMode,       setViewMode]       = useState<"grid" | "list">("grid");
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [isLoading,      setIsLoading]      = useState(true);
  const [vehicles,       setVehicles]       = useState<any[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`);
        const data = await res.json();
        if (data.status === 'success') {
          // Transform backend data to match frontend format
          const transformedVehicles = data.data.vehicles.map((v: any) => ({
            id:             v.id,
            name:           v.name,
            brand:          v.brand,
            type:           v.type,
            fuel:           v.fueltype || 'Petrol',
            fueltype:       v.fueltype || 'Petrol',
            price:          `₹${(v.price / 100000).toFixed(2)} L`,
            priceNum:       v.price,
            rating:         v.rating || 4.5,
            reviews:        v.reviews || 100,
            image:          v.image_url || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&q=80',
            // Specs
            engine:         v.engine,
            transmission:   v.transmission,
            horsepower:     v.horsepower,
            torque:         v.torque,
            mileage:        v.mileage,
            seats:          v.seats,
            top_speed:      v.top_speed,
            warranty:       v.warranty,
            // Color variants
            color_variants: Array.isArray(v.color_variants) ? v.color_variants : [],
          }));
          setVehicles(transformedVehicles);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
        // Fallback to static data if API fails
        setVehicles(VEHICLES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const toggleFuel = (f: FuelType) =>
    setSelectedFuels((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);

  const resetFilters = () => {
    setSelectedType("All");
    setSelectedFuels([]);
    setSelectedBrands([]);
    setMaxPrice(3000000);
    setSearch("");
  };

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => {
      if (selectedType !== "All" && v.type !== selectedType) return false;
      if (selectedFuels.length > 0 && !selectedFuels.includes(v.fuel)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(v.brand)) return false;
      if (v.priceNum > maxPrice) return false;
      if (search && !`${v.name} ${v.brand}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    if (sortBy === "price_asc")  list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    if (sortBy === "price_desc") list = [...list].sort((a, b) => b.priceNum - a.priceNum);
    if (sortBy === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "reviews")    list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [selectedType, selectedFuels, selectedBrands, maxPrice, search, sortBy, vehicles]);

  const activeFilterCount =
    (selectedType !== "All" ? 1 : 0) + selectedFuels.length + selectedBrands.length +
    (maxPrice < 3000000 ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />

      {/* ── Page Header ── */}
      <div className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Vehicles</span>
            {selectedType !== "All" && <><span>/</span><span className="text-cyan-400">{selectedType}s</span></>}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-2">
                {selectedType === "All" ? "All Vehicles" : `${selectedType}s`}
              </h1>
              <p className="text-slate-500 text-sm">
                Showing <span className="text-cyan-400 font-semibold">{filtered.length}</span> of {vehicles.length} vehicles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text" placeholder="Search vehicles..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]
                text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40
                transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown size={14} className="text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500/40 cursor-pointer"
            >
              <option value="rating">Best Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl">
            {(["grid", "list"] as const).map((mode) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`p-2 rounded-lg transition-all ${viewMode === mode ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
              >
                {mode === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── Active Filter Tags ── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedType !== "All" && (
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/25 text-cyan-300">
                {selectedType}
                <button onClick={() => setSelectedType("All")}><X size={11} /></button>
              </span>
            )}
            {selectedFuels.map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300">
                {f}
                <button onClick={() => toggleFuel(f)}><X size={11} /></button>
              </span>
            ))}
            {selectedBrands.map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-300">
                {b}
                <button onClick={() => toggleBrand(b)}><X size={11} /></button>
              </span>
            ))}
            <button onClick={resetFilters} className="text-xs px-3 py-1.5 rounded-full text-slate-500 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all">
              Clear all
            </button>
          </div>
        )}

        {/* ── Main Layout ── */}
        <div className="flex gap-8">

          {/* Sidebar — Desktop */}
          <div className="hidden lg:block">
            <SidebarFilters
              selectedType={selectedType} setSelectedType={setSelectedType}
              selectedFuels={selectedFuels} toggleFuel={toggleFuel}
              selectedBrands={selectedBrands} toggleBrand={toggleBrand}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              resetFilters={resetFilters}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#080F1E] border-r border-white/[0.08] p-5 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-white">Filters</span>
                    <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  <SidebarFilters
                    selectedType={selectedType} setSelectedType={(v) => { setSelectedType(v); setSidebarOpen(false); }}
                    selectedFuels={selectedFuels} toggleFuel={toggleFuel}
                    selectedBrands={selectedBrands} toggleBrand={toggleBrand}
                    maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                    resetFilters={() => { resetFilters(); setSidebarOpen(false); }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Cards Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-white/[0.02] border border-white/[0.06] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display font-bold text-white text-2xl mb-2">No results found</h3>
                <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search term</p>
                <button onClick={resetFilters} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold">
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${selectedType}-${selectedFuels.join()}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`grid gap-5 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filtered.map((v, i) => (
                  <Link key={v.id} href={`/vehicles/${v.id}`} className="block">
                    <VehicleCard
                      {...v}
                      index={i}
                      variant={viewMode === "list" ? "horizontal" : "default"}
                      onView={(id) => console.log("View:", id)}
                    />
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading vehicles...</div>
      </div>
    }>
      <VehiclesContent />
    </Suspense>
  );
}
