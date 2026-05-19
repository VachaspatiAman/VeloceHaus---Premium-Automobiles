import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HelpPageClient from "./HelpPageClient";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to your questions about AutoDrive AI — vehicles, orders, test drives and more.",
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <HelpPageClient />
      <Footer />
    </div>
  );
}
