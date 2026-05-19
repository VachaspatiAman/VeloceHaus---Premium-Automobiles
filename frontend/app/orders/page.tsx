"use client";

import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  vehicles: {
    id: string;
    name: string;
    image_url: string;
    price: number;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/myorders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.status === "success") setOrders(data.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full"><CheckCircle size={12} /> {status}</span>;
      case "pending":
      case "processing":
        return <span className="flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full"><Clock size={12} /> {status}</span>;
      case "cancelled":
        return <span className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full"><XCircle size={12} /> {status}</span>;
      default:
        return <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-400/10 px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="font-display font-black text-4xl text-white mb-8">
          My <span className="text-cyan-400">Orders</span>
        </h1>

        {loading ? (
          <div className="text-cyan-400 text-center py-12">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <Package size={48} className="text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No orders found</h2>
            <p className="text-slate-400 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link href="/vehicles" className="inline-block px-6 py-3 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition-colors">
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="flex flex-wrap items-center justify-between p-5 bg-white/[0.02] border-b border-white/[0.05] gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="text-sm font-semibold text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total</p>
                      <p className="text-sm font-semibold text-cyan-400">₹{order.total_amount?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-slate-500 font-mono">#{order.id.slice(0,8)}</span>
                  </div>
                </div>
                
                <div className="p-5 divide-y divide-white/[0.05]">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.05]">
                        {item.vehicles?.image_url && (
                          <Image src={item.vehicles.image_url} alt={item.vehicles.name} fill sizes="96px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <Link href={`/vehicles/${item.vehicles?.id}`} className="font-semibold text-white hover:text-cyan-400 transition-colors truncate mb-1">
                          {item.vehicles?.name}
                        </Link>
                        <div className="text-sm text-slate-400">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                        </div>
                      </div>
                      <div className="font-bold text-white flex items-center">
                        ₹{(item.quantity * item.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
