"use client";

import { motion } from "framer-motion";
import { Zap, Target, Users, Award, Globe, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STATS = [
  { val: "2022",  lbl: "Founded"       },
  { val: "50K+",  lbl: "Happy Buyers"  },
  { val: "500+",  lbl: "Listings"      },
  { val: "120+",  lbl: "Brand Partners"},
];

const TEAM = [
  { name: "Arjun Mehta",    role: "Co-Founder & CEO",      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Priya Sharma",   role: "Co-Founder & CTO",      img: "https://images.unsplash.com/photo-1494790108755-2616b88a8959?w=300&q=80" },
  { name: "Rahul Verma",    role: "Head of AI & Data",     img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
  { name: "Sneha Patel",    role: "Head of Design",        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
  { name: "Karan Singh",    role: "VP of Partnerships",    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
  { name: "Meena Krishnan", role: "Head of Marketing",     img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80" },
];

const VALUES = [
  { Icon: Target,     title: "Customer First",   desc: "Every decision we make starts with one question: does this help our customer find their perfect vehicle faster?" },
  { Icon: Zap,        title: "AI Innovation",    desc: "We continuously push the boundaries of what's possible with machine learning in the automobile discovery space." },
  { Icon: Users,      title: "Community",        desc: "We believe buying a vehicle should be a community experience — with real reviews, honest comparisons, and shared wisdom." },
  { Icon: Award,      title: "Excellence",       desc: "From our codebase to our customer support, we hold ourselves to the highest standards in everything we deliver." },
  { Icon: Globe,      title: "Accessibility",    desc: "India-first, but globally minded. We're building tools that make premium automobile discovery accessible to everyone." },
  { Icon: TrendingUp, title: "Transparency",     desc: "We believe in showing real prices, honest AI scores, and unbiased data so you can trust every recommendation." },
];

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

export default function AboutPageClient() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-cyan-500/8 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-violet-600/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-cyan-500/20 text-cyan-400 text-xs font-bold">
              <Zap size={13} fill="currentColor" />
              Our Story
            </div>
            <h1 className="font-display font-black text-5xl sm:text-7xl text-white mb-6 leading-tight">
              We&apos;re{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                AutoDrive AI
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
              India&apos;s first AI-powered automobile discovery platform — built to make finding
              your perfect car or bike as exciting as driving it.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {/* ── Stats ── */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.lbl}
              variants={fadeUp}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center"
            >
              <div className="font-display font-black text-4xl bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent mb-1">
                {s.val}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">{s.lbl}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Mission ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28"
        >
          <div>
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">✦ Our Mission</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6 leading-tight">
              Reimagining how India
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                buys vehicles
              </span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-5">
              We started AutoDrive AI because buying a car or bike in India was still a frustrating,
              opaque experience — endless dealership visits, confusing pricing, and generic advice
              that didn&apos;t match your actual needs.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Our AI engine learns your preferences, lifestyle, and budget to surface vehicles that
              truly fit you — not just the ones with the highest dealer margins. We&apos;re leveling
              the playing field for every Indian buyer.
            </p>
            <Link href="/vehicles">
              <motion.span
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                  bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold
                  shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                Explore Vehicles
                <ChevronRight size={15} />
              </motion.span>
            </Link>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.07] h-[380px]">
            <Image
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=85"
              alt="AutoDrive AI Mission"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/60 to-transparent" />
          </div>
        </motion.div>

        {/* ── Values ── */}
        <div className="mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">✦ What We Stand For</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Our Values</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {VALUES.map(({ Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Team ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">✦ The People</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white">Meet Our Team</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5"
          >
            {TEAM.map(({ name, role, img }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="text-center group"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/[0.08] mb-3 group-hover:border-cyan-500/25 transition-colors">
                  <Image src={img} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="font-semibold text-white text-sm">{name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{role}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
