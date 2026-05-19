import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description: "Automotive insights, EV trends, and expert reviews from the AutoDrive AI team.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050B18]">
      <Navbar />
      <BlogPageClient />
      <Footer />
    </div>
  );
}
