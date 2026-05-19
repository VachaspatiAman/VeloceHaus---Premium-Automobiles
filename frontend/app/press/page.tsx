import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PressPageClient from "./PressPageClient";

export const metadata: Metadata = {
  title: "Press Kit",
  description: "Media resources, logos, and press releases for AutoDrive AI.",
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <PressPageClient />
      <Footer />
    </div>
  );
}
