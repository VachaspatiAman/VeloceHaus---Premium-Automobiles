"use client";

import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2,
  Twitter, Instagram, Youtube, Github,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── FAQ ───────────────────────────────────────────────────── */
const FAQS = [
  { q: "How does the AI recommendation work?",        a: "Our AI analyzes your budget, fuel preference, usage pattern, and browsing history to score and rank vehicles specifically matched to your needs with up to 98% accuracy." },
  { q: "Are the listed prices inclusive of taxes?",   a: "Prices shown are ex-showroom. On-road pricing includes registration charges, road tax, insurance, and accessories which vary by state." },
  { q: "Can I schedule a test drive?",                a: "Yes! Click 'Book Test Drive' on any vehicle detail page to schedule at your nearest dealership. We'll confirm within 24 hours." },
  { q: "How do I compare multiple vehicles?",         a: "Visit the Compare page from the navbar, and use the + button to add up to 3 vehicles for side-by-side spec comparison with AI verdict." },
];

/* ─── Contact Info Card ──────────────────────────────────────── */
function InfoCard({
  icon: Icon, label, value, sub, gradient,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/25 transition-all duration-300"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
        {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  );
}

/* ─── FAQ Item ───────────────────────────────────────────────── */
function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className="border border-white/[0.07] rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <MessageSquare
          size={15}
          className={`flex-shrink-0 transition-colors ${open ? "text-cyan-400" : "text-slate-600"}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/[0.05]"
        >
          <div className="pt-3">{a}</div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Contact Page ───────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors";

  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-violet-600/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-cyan-400 text-xs font-bold">
              <Mail size={13} />
              We&apos;d love to hear from you
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-white mb-4 leading-tight">
              Get in{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
              Have a question, partnership idea, or need help choosing your perfect vehicle? We&apos;re here for you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-20">

          {/* ── Left: Info ── */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="font-display font-bold text-white text-2xl mb-6">Contact Info</h2>
              <div className="space-y-3">
                <InfoCard icon={Mail}   label="Email"   value="support@autodrive.ai" sub="Reply within 2 hours" gradient="from-cyan-500 to-blue-600" />
                <InfoCard icon={Phone}  label="Phone"   value="+91 98765 43210"       sub="Mon–Sat, 9AM–6PM IST" gradient="from-violet-500 to-purple-700" />
                <InfoCard icon={MapPin} label="Office"  value="Bandra Kurla Complex"  sub="Mumbai, Maharashtra 400051" gradient="from-orange-500 to-red-600" />
                <InfoCard icon={Clock}  label="Support Hours" value="Mon–Sat: 9AM to 6PM IST" gradient="from-green-500 to-emerald-600" />
              </div>

              {/* Socials */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { Icon: Twitter,   label: "Twitter",   href: "#", color: "hover:bg-sky-500/20 hover:border-sky-500/30 hover:text-sky-400" },
                    { Icon: Instagram, label: "Instagram", href: "#", color: "hover:bg-pink-500/20 hover:border-pink-500/30 hover:text-pink-400" },
                    { Icon: Youtube,   label: "YouTube",   href: "#", color: "hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400" },
                    { Icon: Github,    label: "GitHub",    href: "#", color: "hover:bg-white/10 hover:border-white/20 hover:text-white" },
                  ].map(({ Icon, label, href, color }) => (
                    <motion.a
                      key={label} href={href} aria-label={label}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 transition-all ${color}`}
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02]"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 size={30} className="text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-white text-2xl">Message Sent!</h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    Thank you for reaching out. Our team will get back to you within 2 business hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-display font-bold text-white text-2xl mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-500 font-medium block mb-1.5">Your Name *</label>
                        <input
                          required type="text" placeholder="Arjun Mehta"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium block mb-1.5">Email Address *</label>
                        <input
                          required type="email" placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 font-medium block mb-1.5">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">Select a topic...</option>
                        <option value="general">General Inquiry</option>
                        <option value="vehicle">Vehicle Information</option>
                        <option value="test-drive">Test Drive Booking</option>
                        <option value="partnership">Partnership</option>
                        <option value="support">Technical Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 font-medium block mb-1.5">Message *</label>
                      <textarea
                        required rows={5}
                        placeholder="Tell us how we can help you..."
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(0,212,255,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                        bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold
                        shadow-lg shadow-cyan-500/20 disabled:opacity-60 transition-all"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send size={15} />
                      )}
                      {loading ? "Sending..." : "Send Message"}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">✦ FAQ</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              Common Questions
            </h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} i={i} />)}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
