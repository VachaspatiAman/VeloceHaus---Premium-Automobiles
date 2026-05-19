"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

interface WishlistItem {
  id: string;
  vehicles: {
    id: string;
    name: string;
    brand: string;
    price: number;
    image_url: string;
    type: string;
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.status === "success") setItems(data.data.wishlist || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/wishlist/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (id: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ vehicle_id: id, quantity: 1 }),
      });
      if (res.ok) {
        alert("Added to cart");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="font-display font-black text-4xl text-white mb-8">
          My <span className="text-violet-400">Wishlist</span>
        </h1>

        {loading ? (
          <div className="text-cyan-400 text-center py-12">Loading wishlist...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <Heart size={48} className="text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-slate-400 mb-6">Save vehicles you love to your wishlist.</p>
            <Link href="/vehicles" className="inline-block px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors">
              Explore Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden group">
                <Link href={`/vehicles/${item.vehicles.id}`}>
                  <div className="relative h-48 w-full overflow-hidden">
                    {item.vehicles?.image_url && (
                      <Image src={item.vehicles.image_url} alt={item.vehicles.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white/80 border border-white/10 uppercase">
                      {item.vehicles?.brand}
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg truncate mb-1">{item.vehicles?.name}</h3>
                  <div className="text-cyan-400 font-bold mb-4">₹{item.vehicles?.price?.toLocaleString()}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddToCart(item.vehicles.id)} className="flex-1 py-2 bg-white/[0.05] hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-300 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={14} /> Add
                    </button>
                    <button onClick={() => handleRemove(item.vehicles.id)} className="px-3 py-2 bg-white/[0.05] hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
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
