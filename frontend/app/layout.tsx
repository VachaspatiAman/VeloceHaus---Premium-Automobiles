import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VeloceHaus — Premium Automobiles",
    template: "%s | VeloceHaus",
  },
  description:
    "Discover your perfect car or bike with AI-powered recommendations. Explore premium vehicles with smart filtering and personalized suggestions.",
  keywords: ["cars", "bikes", "automobile", "buy car", "buy bike", "AI recommendations"],
  openGraph: {
    title: "VeloceHaus — Premium Automobiles",
    description: "Discover your perfect vehicle with AI-powered recommendations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#050B18] text-[#F0F6FF] antialiased">
        {children}
      </body>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        strategy="afterInteractive"
      />
    </html>
  );
}
