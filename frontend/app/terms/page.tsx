import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TermsPageClient from "./TermsPageClient";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing your use of AutoDrive AI.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <TermsPageClient />
      <Footer />
    </div>
  );
}
