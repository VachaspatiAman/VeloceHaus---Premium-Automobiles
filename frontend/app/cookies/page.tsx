import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookiesPageClient from "./CookiesPageClient";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How AutoDrive AI uses cookies to improve your browsing experience.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <CookiesPageClient />
      <Footer />
    </div>
  );
}
