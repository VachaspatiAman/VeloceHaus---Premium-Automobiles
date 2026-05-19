"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  quantity: number;
  vehicles: {
    id: string;
    name: string;
    brand: string;
    price: number;
    image_url: string;
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.status === "success") setItems(data.data.cart || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdate = async (id: string, qty: number) => {
    if (qty < 1) return;
    try {
      await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ vehicle_id: id, quantity: qty }),
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/cart/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        alert("Order placed successfully!");
        router.push("/orders");
      } else {
        alert("Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  const total = items.reduce((acc, item) => acc + item.quantity * (item.vehicles?.price || 0), 0);

  return (
    <div className="min-h-screen bg-[#050B18] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="font-display font-black text-4xl text-white mb-8">
          Shopping <span className="text-cyan-400">Cart</span>
        </h1>

        {loading ? (
          <div className="text-cyan-400 text-center py-12">Loading cart...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <ShoppingBag size={48} className="text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-400 mb-6">Looks like you haven't added any vehicles yet.</p>
            <Link href="/vehicles" className="inline-block px-6 py-3 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition-colors">
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    {item.vehicles?.image_url && (
                      <Image src={item.vehicles.image_url} alt={item.vehicles.name} fill className="object-cover" sizes="128px" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">{item.vehicles?.brand}</p>
                        <h3 className="font-bold text-white text-lg">{item.vehicles?.name}</h3>
                      </div>
                      <button onClick={() => handleRemove(item.vehicles.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="font-bold text-cyan-400">₹{item.vehicles?.price?.toLocaleString()}</div>
                      <div className="flex items-center gap-3 bg-white/[0.05] rounded-lg px-2 py-1">
                        <button onClick={() => handleUpdate(item.vehicles.id, item.quantity - 1)} className="text-slate-400 hover:text-white"><Minus size={14} /></button>
                        <span className="text-white text-sm font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdate(item.vehicles.id, item.quantity + 1)} className="text-slate-400 hover:text-white"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-white text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Taxes (0%)</span>
                  <span>₹0</span>
                </div>
                <div className="border-t border-white/[0.08] pt-3 flex justify-between font-bold text-white text-lg">
                  <span>Total</span>
                  <span className="text-cyan-400">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
