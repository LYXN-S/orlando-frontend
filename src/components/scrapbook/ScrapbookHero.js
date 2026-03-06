import React from 'react';
import { ChevronDown } from 'lucide-react';

const ScrapbookHero = () => {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-aged-paper">
      {/* Kraft paper texture background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle grid lines like notebook paper */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #8B5E3C 0px, transparent 1px, transparent 40px)',
          backgroundSize: '100% 40px',
        }}
      />

      {/* Decorative tape element — top left */}
      <div className="absolute left-8 top-8 md:left-16 md:top-12">
        <div
          className="h-6 w-24 -rotate-12 rounded-sm bg-kraft/60 shadow-sm"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 6px)',
          }}
        />
      </div>

      {/* Decorative tape element — top right */}
      <div className="absolute right-8 top-16 md:right-20 md:top-16">
        <div
          className="h-6 w-20 rotate-6 rounded-sm bg-kraft/50 shadow-sm"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)',
          }}
        />
      </div>

      {/* Stamp element — bottom right */}
      <div className="absolute bottom-32 right-8 hidden md:block md:right-20">
        <div className="flex h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full border-[3px] border-dashed border-terracotta/40">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-terracotta/30">
            <div className="text-center">
              <p className="font-handwritten text-xs font-bold uppercase tracking-wider text-terracotta/60">
                Est.
              </p>
              <p className="font-serif text-lg font-bold text-terracotta/50">
                2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Small tag above brand name */}
        <div className="mb-6 inline-block rounded-sm bg-white/60 px-4 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="font-handwritten text-sm tracking-wide text-primary/70">
            ✦ Premium Italian Imports ✦
          </span>
        </div>

        {/* Logo */}
        <img src="/orlando_logo.jpg" alt="Orlando Prestige" className="mb-6 h-32 w-auto rounded-xl shadow-md md:h-40 lg:h-48" />

        {/* Brand name */}
        <h1 className="font-serif text-5xl font-bold leading-tight text-espresso md:text-7xl lg:text-8xl">
          Orlando
          <br />
          <span className="text-primary">Prestige</span>
        </h1>

        {/* Handwritten tagline */}
        <p className="mt-6 font-handwritten text-2xl text-primary/70 md:text-3xl lg:text-4xl">
          From Italian farms to your table
        </p>

        {/* Brief description */}
        <p className="mt-6 max-w-lg text-base leading-relaxed text-espresso/60 md:text-lg">
          Curating the finest Mediterranean flavors — hand-selected olive oils,
          artisan pastas, and sun-ripened produce sourced directly from Italy's
          most dedicated producers.
        </p>

        {/* Decorative divider */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-px w-12 bg-kraft" />
          <div className="h-2 w-2 rotate-45 border border-kraft" />
          <div className="h-px w-12 bg-kraft" />
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToContent}
          className="mt-12 flex animate-bounce flex-col items-center gap-1 text-primary/40 transition-colors hover:text-primary/70"
          aria-label="Scroll down"
        >
          <span className="font-handwritten text-sm">scroll down</span>
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Torn paper edge at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
        <svg
          viewBox="0 0 1200 40"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20 Q30 5 60 18 Q90 35 120 15 Q150 0 180 20 Q210 38 240 12 Q270 2 300 22 Q330 36 360 14 Q390 4 420 24 Q450 38 480 10 Q510 0 540 20 Q570 36 600 16 Q630 2 660 22 Q690 38 720 12 Q750 0 780 24 Q810 36 840 14 Q870 2 900 20 Q930 38 960 10 Q990 0 1020 22 Q1050 36 1080 16 Q1110 2 1140 24 Q1170 38 1200 14 L1200 40 L0 40 Z"
            fill="#FEFCF9"
          />
        </svg>
      </div>
    </section>
  );
};

export default ScrapbookHero;
