"use client";
import { useEffect, useState } from 'react';
import { Users, Car, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Vehicles', value: stats.totalVehicles, icon: Car, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-gray-400 mt-1">Here is what is happening with your platform today.</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder for future charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 flex items-center justify-center shadow-sm">
          <p className="text-gray-500 font-medium">Revenue Chart (Coming Soon)</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 flex items-center justify-center shadow-sm">
          <p className="text-gray-500 font-medium">Recent Orders (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}
