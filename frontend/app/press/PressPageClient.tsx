"use client";

import { motion } from "framer-motion";
import { Download, Image as ImageIcon, FileText, Newspaper, Zap, ExternalLink } from "lucide-react";

const COVERAGE = [
  { outlet: "Economic Times",    headline: "AutoDrive AI raises ₹45Cr seed round to disrupt India's automobile market",  date: "Mar 2025", color: "text-blue-400" },
  { outlet: "YourStory",         headline: "Meet the startup using AI to help Indians find their perfect car in 60 seconds", date: "Feb 2025", color: "text-purple-400" },
  { outlet: "The Hindu Business", headline: "AutoDrive AI crosses 50,000 happy buyers, targets 5 lakh by 2026",              date: "Jan 2025", color: "text-red-400"  },
  { outlet: "TechCrunch India",  headline: "How AutoDrive AI is applying recommendation engine tech to the $100B auto market",date: "Dec 2024", color: "text-green-400" },
];

const ASSETS = [
  { Icon: ImageIcon,  label: "Brand Logo Pack",      sub: "SVG + PNG, light & dark variants", size: "2.4 MB", color: "from-cyan-500 to-blue-600"   },
  { Icon: FileText,   label: "Brand Guidelines",     sub: "Colors, typography, do's & don'ts", size: "8.1 MB", color: "from-violet-500 to-purple-700" },
  { Icon: ImageIcon,  label: "Product Screenshots",  sub: "High-res UI screenshots (2x)",      size: "24 MB",  color: "from-amber-500 to-orange-600"  },
  { Icon: FileText,   label: "Company Fact Sheet",   sub: "Key metrics & milestones PDF",       size: "1.2 MB", color: "from-green-500 to-emerald-600"  },
  { Icon: Newspaper,  label: "Press Releases",       sub: "All official announcements",          size: "3.6 MB", color: "from-red-500 to-rose-600"       },
];

const MILESTONES = [
  { year: "2022 Q2", event: "AutoDrive AI founded in Mumbai by Arjun Mehta & Priya Sharma" },
  { year: "2022 Q4", event: "Launched private beta with 200 vehicles across 5 cities" },
  { year: "2023 Q2", event: "Crossed 500 listings and 10,000 registered users" },
  { year: "2024 Q1", event: "Raised ₹45Cr seed round led by Prime Ventures" },
  { year: "2024 Q3", event: "Launched AI Advisor feature — 97% recommendation accuracy" },
  { year: "2025 Q1", event: "50,000 verified buyers · 120+ brand partnerships" },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function PressPageClient() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[280px] bg-amber-500/6 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-amber-400 text-xs font-bold">
              <Newspaper size={13} />
              Press & Media
            </div>
            <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-5">
              Press{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Kit
              </span>
            </h1>
            <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base mb-6">
              Everything journalists and creators need to cover AutoDrive AI.
            </p>
            <a
              href="mailto:press@autodrive.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm font-semibold hover:bg-white/[0.09] transition-all"
            >
              Contact Press Team
              <ExternalLink size={13} />
            </a>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {/* ── Quick Facts ── */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
        >
          {[
            { val: "2022",   lbl: "Founded"              },
            { val: "50K+",   lbl: "Verified Buyers"      },
            { val: "₹45Cr",  lbl: "Seed Funding Raised"  },
            { val: "120+",   lbl: "Brand Partners"       },
          ].map((s) => (
            <motion.div
              key={s.lbl}
              variants={fadeUp}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center"
            >
              <div className="font-display font-black text-3xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-1">{s.val}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">{s.lbl}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

          {/* ── Brand Assets ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">✦ Downloads</p>
            <h2 className="font-display font-black text-3xl text-white mb-6">Brand Assets</h2>
            <div className="space-y-3">
              {ASSETS.map(({ Icon, label, sub, size, color }) => (
                <motion.div
                  key={label}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/20 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{label}</div>
                    <div className="text-xs text-slate-500">{sub} · {size}</div>
                  </div>
                  <Download size={15} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Timeline ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">✦ History</p>
            <h2 className="font-display font-black text-3xl text-white mb-6">Milestones</h2>
            <div className="relative pl-5">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.08]" />
              {MILESTONES.map(({ year, event }) => (
                <div key={year} className="relative flex gap-4 mb-6">
                  <div className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-cyan-400 mb-1">{year}</div>
                    <div className="text-sm text-slate-300 leading-relaxed">{event}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Press Coverage ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">✦ As Seen In</p>
          <h2 className="font-display font-black text-3xl text-white mb-6">Press Coverage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COVERAGE.map(({ outlet, headline, date, color }) => (
              <motion.div
                key={outlet}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] transition-all cursor-pointer group"
              >
                <div className={`text-xs font-bold mb-3 ${color}`}>{outlet}</div>
                <p className="text-sm text-white font-medium leading-snug mb-3 group-hover:text-cyan-300 transition-colors">&ldquo;{headline}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">{date}</span>
                  <ExternalLink size={12} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Contact ── */}
        <div className="mt-16 p-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
          <Zap size={24} className="text-amber-400 mx-auto mb-3" />
          <h3 className="font-display font-bold text-white text-xl mb-2">Press Enquiries</h3>
          <p className="text-slate-400 text-sm mb-4">For interviews, exclusive features, or any media-related queries, reach our PR team.</p>
          <a href="mailto:press@autodrive.ai" className="text-amber-400 font-semibold text-sm hover:underline">
            press@autodrive.ai
          </a>
        </div>
      </div>
    </>
  );
}
