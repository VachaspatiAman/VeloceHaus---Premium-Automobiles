import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareersPageClient from "./CareersPageClient";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the AutoDrive AI team and help build the future of automobile discovery.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <CareersPageClient />
      <Footer />
    </div>
  );
}
