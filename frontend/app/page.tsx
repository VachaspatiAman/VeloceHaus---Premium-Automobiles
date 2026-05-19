import Navbar                from "@/components/Navbar";
import HeroSection           from "@/components/HeroSection";
import FeaturedVehicles      from "@/components/FeaturedVehicles";
import CategorySection       from "@/components/CategorySection";
import RecommendationSection from "@/components/RecommendationSection";
import Footer                from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050B18] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturedVehicles />
      <CategorySection />
      <RecommendationSection />
      <Footer />
    </main>
  );
}
