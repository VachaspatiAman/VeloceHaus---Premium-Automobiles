"use client";

import { motion } from "framer-motion";
import { Zap, Twitter, Instagram, Youtube, Github, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

/* ─── Data ─────────────────────────────────────────────────── */
const footerLinks: Record<string, { label: string; href: string }[]> = {
  Vehicles: [
    { label: "All Cars", href: "/vehicles?type=Car" },
    { label: "All Bikes", href: "/vehicles?type=Bike" },
    { label: "Electric Vehicles", href: "/vehicles?fuel=Electric" },
    { label: "Luxury Cars", href: "/vehicles?tag=Luxury" },
    { label: "Budget Bikes", href: "/vehicles?budget=low" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press Kit", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Sitemap", href: "/sitemap" },
  ],
};

const socials = [
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Youtube, href: "#", label: "YouTube" },
  { Icon: Github, href: "#", label: "GitHub" },
];

const contactItems = [
  { Icon: Mail, text: "support@autodrive.ai" },
  { Icon: Phone, text: "+91 98765 43210" },
  { Icon: MapPin, text: "Mumbai, India" },
];

/* ─── Footer ───────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] overflow-hidden">
      {/* Glow accents */}
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-cyan-500/6 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[250px] h-[150px] bg-violet-600/6 blur-[70px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl overflow-hidden my-16 p-8 sm:p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(124,58,237,0.1) 100%)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-600/5" />
          <div className="relative z-10">
            <h3 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">
              Find Your Dream{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Vehicle Today
              </span>
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Let our AI advisor match you with the perfect car or bike in under 60 seconds.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,212,255,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                bg-gradient-to-r from-cyan-500 to-violet-600
                text-sm font-semibold text-white shadow-lg shadow-cyan-500/25"
            >
              <Zap size={15} fill="white" />
              Start AI Advisor Free
            </motion.button>
          </div>
        </motion.div>

        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12">

          {/* Brand Column */}
          <div className="col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <img 
                src="https://res.cloudinary.com/dtdvglgx4/image/upload/v1778881976/logo_p7dajp.ico" 
                alt="VeloceHaus Logo" 
                className="w-8 h-8 rounded-lg shadow-lg"
              />
              <span className="font-display font-extrabold text-lg">
                <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Veloce</span>
                <span className="text-cyan-400">Haus</span>
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              VeloceHaus delivers high-performance cars and premium bikes built for speed, luxury,
              and precision—crafted to create an unforgettable driving experience.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6">
              {contactItems.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-slate-500 text-sm hover:text-slate-300 transition-colors">
                  <Icon size={13} className="text-cyan-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08]
                    flex items-center justify-center text-slate-400
                    hover:bg-cyan-500/15 hover:border-cyan-500/30 hover:text-cyan-400
                    transition-colors duration-200"
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-slate-500 text-sm hover:text-white hover:translate-x-1
                        inline-block transition-all duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4
          py-6 border-t border-white/[0.06]">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} AutoDrive AI. All rights reserved. Built with ❤️ in India.
          </p>
          <div className="flex items-center gap-4">
            {([
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
            ] as { label: string; href: string }[]).map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-slate-600 hover:text-slate-300 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
