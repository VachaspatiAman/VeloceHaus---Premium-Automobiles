import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full bg-black text-white overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Assets/Car Wash.png"
          alt="Car"
          fill
          priority
          className="object-cover object-right opacity-90"
        />

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/0 to-transparent" />

        {/* EXTRA LEFT DARKNESS (for text clarity) */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* BIG BACK TEXT */}
      {/* <h1 className="absolute top-16 right-10 text-[120px] font-extrabold text-white/5 tracking-widest select-none pointer-events-none">
        VELOCEHAUS
      </h1>

      {/* SMALL BRAND TEXT */}
      {/* <p className="absolute top-24 right-16 text-xl italic text-white/70">
        Veloce Haus
      </p> */}

      {/* CONTENT */}
      <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4">
        <div className="max-w-xl">

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-wide">
            WHERE <br />
            ENGINEERING <br />
            MEETS ART
          </h1>

          <p className="mt-6 text-gray-300 text-lg leading-relaxed">
            Discover high-performance machines designed for speed,
            luxury and precision.
          </p>

          <Link
            href="/vehicles"
            id="hero-explore-btn"
            className="mt-8 px-7 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all duration-200 rounded-lg font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5"
          >
            EXPLORE CARS →
          </Link>
        </div>
      </div>
    </section>
  );
}