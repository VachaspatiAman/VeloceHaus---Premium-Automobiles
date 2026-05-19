"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Calendar, Clock } from "lucide-react";

interface Section { title: string; content: string; }

interface LegalPageProps {
  icon: ReactNode;
  badge: string;
  badgeColor: string;
  title: string;
  lastUpdated: string;
  readTime: string;
  lead: string;
  sections: Section[];
}

export function LegalPageLayout({
  icon, badge, badgeColor, title, lastUpdated, readTime, lead, sections,
}: LegalPageProps) {
  return (
    <>
      {/* ── Hero ── */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[400px] h-[200px] bg-violet-600/6 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border ${badgeColor} text-xs font-bold`}>
              {icon}
              {badge}
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-white mb-5">{title}</h1>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar size={11} /> Last updated: {lastUpdated}</span>
              <span className="flex items-center gap-1.5"><Clock size={11} /> {readTime} read</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] mb-8"
        >
          <p className="text-slate-300 text-base leading-relaxed">{lead}</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map(({ title: st, content }, i) => (
            <motion.section
              key={st}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <h2 className="font-display font-bold text-white text-xl mb-3 flex items-center gap-2">
                <span className="text-cyan-500 text-sm font-mono">{String(i + 1).padStart(2, "0")}.</span>
                {st}
              </h2>
              <div className="text-slate-400 text-sm leading-[1.9] border-l-2 border-white/[0.06] pl-4">
                {content.split("\n").map((line, li) => (
                  line ? <p key={li} className="mb-2">{line}</p> : <br key={li} />
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] text-center">
          <p className="text-slate-500 text-sm">
            Questions about this policy?{" "}
            <a href="mailto:legal@autodrive.ai" className="text-cyan-400 hover:underline font-medium">
              Contact our legal team →
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
