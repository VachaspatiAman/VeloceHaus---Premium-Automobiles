"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Car, ShoppingCart, Users, LogOut, ArrowLeft, Shield } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('');
  const [checking, setChecking] = useState(true);

  // ── Role Guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const user = userRaw ? JSON.parse(userRaw) : null;
      const role: string = user?.role ?? '';

      if (role !== 'admin' && role !== 'superadmin') {
        // Not authorized — kick out
        router.replace('/login');
        return;
      }

      setUserName(user?.full_name || user?.name || 'Admin');
      setUserRole(role);
    } catch {
      router.replace('/login');
      return;
    }

    setChecking(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    // Users section is superadmin-only
    ...(userRole === 'superadmin' ? [{ name: 'Users', href: '/admin/users', icon: Users }] : []),
  ];

  // Show a blank screen while checking role to avoid flash
  if (checking) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        {/* ── Back to Site button ── */}
        <div className="px-4 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-gray-400
                       hover:bg-gray-800 hover:text-white transition-all duration-200 group w-full"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back to Site</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-red-600/10 text-red-500 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${isActive ? 'text-red-500' : 'text-gray-400'}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: role badge + logout */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          {/* Role badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50">
            <Shield className={`w-4 h-4 shrink-0 ${userRole === 'superadmin' ? 'text-yellow-400' : 'text-red-400'}`} />
            <div className="min-w-0">
              <p className="text-xs text-white font-medium truncate">{userName}</p>
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${userRole === 'superadmin' ? 'text-yellow-400' : 'text-red-400'}`}>
                {userRole}
              </p>
            </div>
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400
                       hover:text-white hover:bg-gray-800 rounded-xl transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10">
          {/* Mobile back button (visible on small screens) */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors md:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="hidden md:block text-sm text-gray-400">
            Welcome back,{' '}
            <span className="text-white font-medium">{userName}</span>
          </div>
          {/* Role badge in header */}
          <span
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${
              userRole === 'superadmin'
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            <Shield className="w-3 h-3" />
            {userRole}
          </span>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
