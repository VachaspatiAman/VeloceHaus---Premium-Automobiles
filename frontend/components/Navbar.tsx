"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X, Heart, GitCompare, Search, LogOut, User, ShoppingCart, Package } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Cars", href: "/vehicles?type=Car" },
  { label: "Bikes", href: "/vehicles?type=Bike" },
  { label: "Compare", href: "/compare" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishCount, setWishCount] = useState(2); // mock wishlist count
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Check for user in localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#050B18]/85 backdrop-blur-2xl border-b border-white/[0.07] shadow-2xl shadow-black/40"
        : "bg-transparent backdrop-blur-md"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
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

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="relative px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px w-0 bg-gradient-to-r from-cyan-400 to-violet-500 group-hover:w-4/5 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* ── Desktop Right Actions ── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <button
              aria-label="Search"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <Search size={18} />
            </button>

            {/* Compare */}
            <Link href="/compare"
              aria-label="Compare vehicles"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <GitCompare size={18} />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist"
              aria-label="Wishlist"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-white/[0.06] transition-all"
            >
              <Heart size={18} />
            </Link>

            {/* Cart */}
            <Link href="/cart"
              aria-label="Cart"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-all"
            >
              <ShoppingCart size={18} />
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-white/[0.1] mx-1" />

            {user ? (
              <>
                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <Link href="/profile" className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-2 flex items-center gap-1">
                    <User size={16} />
                    {user.full_name || user.email?.split('@')[0]}
                  </Link>
                  <Link href="/orders" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors px-2 flex items-center gap-1">
                    <Package size={16} />
                    Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors px-2 flex items-center gap-1"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Sign In */}
                <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-2">
                  Sign In
                </Link>

                {/* Get Started */}
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600" />
                    <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{ boxShadow: "0 0 30px rgba(0,212,255,0.4) inset" }}
                    />
                    <Zap size={14} className="relative z-10" fill="white" />
                    <span className="relative z-10">Get Started</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile: Icons + Toggle ── */}
          <div className="flex md:hidden items-center gap-1.5">
            <button aria-label="Wishlist" className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400">
              <Heart size={18} />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </button>
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden border-t border-white/[0.07] bg-[#050B18]/96 backdrop-blur-2xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/[0.07] grid grid-cols-2 gap-2">
                {user ? (
                  <>
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.05] hover:bg-white/10 transition-all flex items-center justify-center gap-1">
                      <User size={16} />
                      Profile
                    </Link>
                    <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center gap-1">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.05] hover:bg-white/10 transition-all">
                      Sign In
                    </Link>
                    <Link href="/register" onClick={() => setMenuOpen(false)} className="py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
