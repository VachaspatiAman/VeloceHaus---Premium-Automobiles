import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about AutoDrive AI — India's first AI-powered automobile discovery platform.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <AboutPageClient />
      <Footer />
    </div>
  );
}
