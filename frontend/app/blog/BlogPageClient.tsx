"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Tag, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CATEGORIES = ["All", "EV & Electric", "Reviews", "Buying Guide", "Industry News", "AI & Tech"];

const POSTS = [
  {
    id: 1,
    category: "EV & Electric",
    title: "Hyundai Creta EV vs Tata Nexon EV Max: Which Should You Buy in 2025?",
    excerpt: "We put India's two most popular electric SUVs through a comprehensive 30-day real-world test to give you the definitive verdict.",
    img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    author: "Arjun Mehta",
    date: "Apr 22, 2025",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 2,
    category: "AI & Tech",
    title: "How Our AI Recommendation Engine Achieves 97% Match Accuracy",
    excerpt: "A deep dive into the hybrid collaborative-filtering and content-based model powering AutoDrive AI's vehicle recommendations.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    author: "Priya Sharma",
    date: "Apr 18, 2025",
    readTime: "12 min read",
    featured: false,
  },
  {
    id: 3,
    category: "Buying Guide",
    title: "The Complete 2025 SUV Buying Guide for Indian Families",
    excerpt: "Everything you need to know about picking the right SUV — from seating and safety to fuel efficiency and budget.",
    img: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
    author: "Rahul Verma",
    date: "Apr 14, 2025",
    readTime: "15 min read",
    featured: false,
  },
  {
    id: 4,
    category: "Reviews",
    title: "Royal Enfield Himalayan 450 Long-Term Review: 10,000 km Later",
    excerpt: "After 6 months and 10,000 km across Ladakh, Spiti, and daily commutes, here's our unfiltered verdict on the Himalayan 450.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    author: "Karan Singh",
    date: "Apr 10, 2025",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: 5,
    category: "Industry News",
    title: "EV Sales Cross 2 Lakh Units in Q1 2025: What's Driving the Surge?",
    excerpt: "India's EV market has officially crossed a major milestone. We break down which segments are growing fastest and why.",
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
    author: "Meena Krishnan",
    date: "Apr 6, 2025",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 6,
    category: "Buying Guide",
    title: "5 Hidden Costs Every New Car Buyer in India Must Know",
    excerpt: "Ex-showroom prices tell just half the story. Here are the charges dealers don't advertise — and how to negotiate them.",
    img: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
    author: "Sneha Patel",
    date: "Apr 1, 2025",
    readTime: "7 min read",
    featured: false,
  },
];

const catColor: Record<string, string> = {
  "EV & Electric":  "text-cyan-400 bg-cyan-500/10",
  "AI & Tech":      "text-violet-400 bg-violet-500/10",
  "Buying Guide":   "text-amber-400 bg-amber-500/10",
  "Reviews":        "text-orange-400 bg-orange-500/10",
  "Industry News":  "text-green-400 bg-green-500/10",
};

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function BlogPageClient() {
  const [active, setActive] = useState("All");
  const featured = POSTS.find((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured && (active === "All" || p.category === active));

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[400px] h-[250px] bg-cyan-500/8 blur-[110px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-cyan-400 text-xs font-bold">
              <BookOpen size={13} />
              AutoDrive AI Blog
            </div>
            <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-4">
              Insights &{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
              Expert reviews, industry trends, and buying guides from our automotive team.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {/* ── Featured Post ── */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-white/[0.08] mb-14 group cursor-pointer"
          >
            <div className="relative h-[380px] sm:h-[480px]">
              <Image src={featured.img} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/50 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${catColor[featured.category]}`}>
                <TrendingUp size={10} />
                {featured.category}
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white mb-3 max-w-2xl leading-tight">
                {featured.title}
              </h2>
              <p className="text-slate-400 text-sm max-w-xl mb-5 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>{featured.author}</span>
                  <span>·</span>
                  <Clock size={10} className="inline" /> {featured.readTime}
                  <span>·</span>
                  <span>{featured.date}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400 text-xs font-semibold ml-auto">
                  Read Article <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Category Filter ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                active === c
                  ? "bg-gradient-to-r from-cyan-500 to-violet-600 border-transparent text-white"
                  : "border-white/[0.1] bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {c !== "All" && <Tag size={11} />}
              {c}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {rest.map(({ id, category, title, excerpt, img, author, date, readTime }) => (
            <motion.div
              key={id}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/20 transition-all group cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <Image src={img} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold mb-3 ${catColor[category] ?? "text-slate-400 bg-white/5"}`}>
                  {category}
                </div>
                <h3 className="font-display font-bold text-white text-sm leading-snug mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{excerpt}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-600 pt-3 border-t border-white/[0.05]">
                  <span>{author} · {date}</span>
                  <span className="flex items-center gap-1"><Clock size={9} />{readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {rest.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">No posts in this category yet.</div>
        )}
      </div>
    </>
  );
}
