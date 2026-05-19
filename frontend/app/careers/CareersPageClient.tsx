"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, Zap, Code2, BarChart3, Palette, Headphones } from "lucide-react";
import { useState } from "react";

const DEPARTMENTS = ["All", "Engineering", "Design", "Marketing", "Data & AI", "Support"];

const JOBS = [
  { id: 1, title: "Senior Full-Stack Engineer",         dept: "Engineering", location: "Mumbai · Hybrid",    type: "Full-time", posted: "2 days ago",   salary: "₹25–45 LPA" },
  { id: 2, title: "ML Engineer — Recommendation Engine", dept: "Data & AI",    location: "Bangalore · Remote", type: "Full-time", posted: "5 days ago",   salary: "₹30–55 LPA" },
  { id: 3, title: "Senior Product Designer",            dept: "Design",       location: "Mumbai · Hybrid",    type: "Full-time", posted: "1 week ago",   salary: "₹18–30 LPA" },
  { id: 4, title: "iOS Developer",                      dept: "Engineering",  location: "Remote",             type: "Full-time", posted: "3 days ago",   salary: "₹20–35 LPA" },
  { id: 5, title: "Growth Marketing Manager",           dept: "Marketing",    location: "Mumbai · On-site",   type: "Full-time", posted: "4 days ago",   salary: "₹15–25 LPA" },
  { id: 6, title: "Data Analyst",                       dept: "Data & AI",    location: "Remote",             type: "Full-time", posted: "1 week ago",   salary: "₹12–20 LPA" },
  { id: 7, title: "Customer Success Executive",         dept: "Support",      location: "Mumbai · On-site",   type: "Full-time", posted: "2 weeks ago",  salary: "₹6–10 LPA"  },
  { id: 8, title: "Brand Designer (Contract)",          dept: "Design",       location: "Remote",             type: "Contract",  posted: "3 weeks ago",  salary: "₹8–15 LPA"  },
];

const PERKS = [
  { Icon: Zap,          title: "AI-First Culture",       desc: "Work at the frontier of AI applied to real-world problems." },
  { Icon: Code2,        title: "Modern Stack",           desc: "Next.js, Python, Supabase, Vercel — no legacy tech." },
  { Icon: BarChart3,    title: "ESOPs for All",          desc: "Every full-time hire gets meaningful stock options." },
  { Icon: Palette,      title: "Creative Freedom",       desc: "Ship fast, experiment boldly, learn from outcomes." },
  { Icon: Headphones,   title: "Remote-Friendly",        desc: "Flexible work from anywhere with async-first culture." },
  { Icon: Briefcase,    title: "₹1L Learning Budget",   desc: "Courses, conferences, books — we invest in your growth." },
];

const deptIcon: Record<string, React.ElementType> = {
  Engineering: Code2,
  Design:      Palette,
  Marketing:   BarChart3,
  "Data & AI": Zap,
  Support:     Headphones,
};

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function CareersPageClient() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? JOBS : JOBS.filter((j) => j.dept === active);

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-violet-600/8 blur-[130px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-violet-500/25 text-violet-400 text-xs font-bold">
              <Briefcase size={13} />
              We&apos;re Hiring
            </div>
            <h1 className="font-display font-black text-5xl sm:text-7xl text-white mb-6 leading-tight">
              Build the Future of{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Automobiles
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              Join a team of builders, designers, and dreamers on a mission to transform how India discovers and buys vehicles.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {/* ── Perks ── */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-20"
        >
          {PERKS.map(({ Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-violet-500/20 transition-all"
            >
              <Icon size={18} className="text-violet-400 mb-3" />
              <div className="font-semibold text-white text-sm mb-1">{title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Open Roles ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">✦ Open Roles</p>
          <h2 className="font-display font-black text-4xl text-white mb-6">
            {filtered.length} Position{filtered.length !== 1 ? "s" : ""} Available
          </h2>

          {/* Department filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                onClick={() => setActive(d)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  active === d
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 border-transparent text-white"
                    : "border-white/[0.1] bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((job, i) => {
              const DeptIcon = deptIcon[job.dept] ?? Briefcase;
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4
                    p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]
                    hover:border-cyan-500/25 hover:bg-white/[0.04] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-violet-600/15 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                      <DeptIcon size={16} className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{job.title}</div>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin size={10} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock size={10} /> {job.posted}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          job.type === "Full-time"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}>{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-shrink-0">
                    <div className="text-sm font-bold text-white">{job.salary}</div>
                    <div className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-500 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── No roles banner ── */}
        <div className="mt-12 p-8 rounded-2xl border border-dashed border-white/[0.1] text-center">
          <p className="text-slate-400 text-sm mb-2">Don&apos;t see a role that fits? We&apos;re always looking for exceptional talent.</p>
          <a
            href="mailto:careers@autodrive.ai"
            className="text-cyan-400 text-sm font-semibold hover:underline"
          >
            Send us your resume →
          </a>
        </div>
      </div>
    </>
  );
}
