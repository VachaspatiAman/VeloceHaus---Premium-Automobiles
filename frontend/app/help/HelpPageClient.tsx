"use client";

import { motion } from "framer-motion";
import { HelpCircle, Search, Car, CreditCard, ShieldCheck, Star, ChevronDown, ChevronUp, Phone, Mail } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { Icon: Car,         label: "Vehicles",       count: 12 },
  { Icon: CreditCard,  label: "Pricing & Fees",  count: 8  },
  { Icon: ShieldCheck, label: "Safety & Trust",  count: 6  },
  { Icon: Star,        label: "AI Advisor",      count: 5  },
];

const FAQS = [
  {
    cat: "Vehicles",
    q: "How do I search for a specific vehicle?",
    a: "Use the search bar at the top of the Vehicles page or apply filters for type (Car/Bike), fuel, brand, and price range. You can also sort results by rating, price, or AI match score.",
  },
  {
    cat: "Vehicles",
    q: "Can I book a test drive through AutoDrive AI?",
    a: "Yes! On any vehicle detail page, click 'Book Test Drive' to schedule an appointment at your nearest dealership. We'll send you a confirmation email within 2 hours with the details.",
  },
  {
    cat: "Vehicles",
    q: "Are all listed vehicles available for immediate purchase?",
    a: "Vehicle availability depends on the dealership. Our listings show real-time stock status. Vehicles marked 'In Stock' are available now; 'On Order' means 4–12 week delivery.",
  },
  {
    cat: "Pricing & Fees",
    q: "Are prices shown ex-showroom or on-road?",
    a: "All prices shown are ex-showroom (manufacturer's published price). On-road pricing adds registration, insurance, road tax, and accessories, which vary by state. Use our on-road price calculator on the vehicle detail page.",
  },
  {
    cat: "Pricing & Fees",
    q: "Does AutoDrive AI charge any fees?",
    a: "AutoDrive AI is completely free for buyers. We earn a referral commission from dealers when a sale is completed — this never affects the price you pay.",
  },
  {
    cat: "AI Advisor",
    q: "How does the AI recommendation work?",
    a: "Our AI analyzes your budget, vehicle type, fuel preference, usage pattern, and selected brands to score every vehicle in our catalog. It weighs these factors using a proprietary algorithm to surface your best matches, ranked by match percentage.",
  },
  {
    cat: "AI Advisor",
    q: "How accurate is the AI Match Score?",
    a: "Our AI achieves ~97% satisfaction in user studies — meaning 97% of buyers who purchased their top AI match rated it a 4/5 or higher. The score reflects how well a vehicle aligns with your stated preferences, not its absolute quality.",
  },
  {
    cat: "Safety & Trust",
    q: "How are listings verified?",
    a: "Every vehicle listed on AutoDrive AI goes through a 3-step verification: dealer license check, RTO documentation review, and a 15-point quality audit. Verified listings display a blue checkmark badge.",
  },
];

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="border border-white/[0.07] rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        {open
          ? <ChevronUp size={15} className="text-cyan-400 flex-shrink-0" />
          : <ChevronDown size={15} className="text-slate-600 flex-shrink-0" />
        }
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/[0.05]"
        >
          <div className="pt-3">{a}</div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HelpPageClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = FAQS.filter(
    (f) =>
      (activeCategory === "All" || f.cat === activeCategory) &&
      (search === "" || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[250px] bg-cyan-500/8 blur-[110px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-cyan-400 text-xs font-bold">
              <HelpCircle size={13} />
              Help Center
            </div>
            <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-5">
              How can we{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                help?
              </span>
            </h1>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-28">

        {/* ── Category Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          {[{ Icon: HelpCircle, label: "All", count: FAQS.length }, ...CATEGORIES].map(({ Icon, label, count }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                activeCategory === label
                  ? "border-cyan-500/40 bg-cyan-500/8 text-white"
                  : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.15] hover:text-white"
              }`}
            >
              <Icon size={18} className={activeCategory === label ? "text-cyan-400" : "text-slate-500"} />
              <div className="text-xs font-semibold">{label}</div>
              <div className="text-[10px] text-slate-600">{count} articles</div>
            </button>
          ))}
        </motion.div>

        {/* ── FAQ List ── */}
        <div className="space-y-3 mb-16">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">No results found for &ldquo;{search}&rdquo;</div>
          ) : (
            filtered.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} i={i} />)
          )}
        </div>

        {/* ── Still need help ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] text-center"
        >
          <h3 className="font-display font-bold text-white text-2xl mb-2">Still need help?</h3>
          <p className="text-slate-400 text-sm mb-6">Our support team is available Monday–Saturday, 9AM–6PM IST.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@autodrive.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold"
            >
              <Mail size={14} /> Email Support
            </a>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] text-slate-300 text-sm font-semibold hover:bg-white/[0.05] transition-all"
            >
              <Phone size={14} /> +91 98765 43210
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
}
