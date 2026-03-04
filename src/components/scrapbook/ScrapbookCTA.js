import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ScrapbookCTA = () => {
  return (
    <section className="relative overflow-hidden bg-aged-paper py-24 md:py-36">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative tape top-right */}
      <div className="absolute right-12 top-8 hidden md:block">
        <div
          className="h-5 w-20 rotate-12 rounded-sm bg-kraft/40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 6px)',
          }}
        />
      </div>

      {/* Decorative tape bottom-left */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div
          className="h-5 w-16 -rotate-6 rounded-sm bg-kraft/35"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)',
          }}
        />
      </div>

      {/* Torn paper edge at top */}
      <div className="absolute left-0 right-0 top-0 h-8 overflow-hidden">
        <svg
          viewBox="0 0 1200 40"
          className="absolute top-0 w-full rotate-180"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20 Q30 5 60 18 Q90 35 120 15 Q150 0 180 20 Q210 38 240 12 Q270 2 300 22 Q330 36 360 14 Q390 4 420 24 Q450 38 480 10 Q510 0 540 20 Q570 36 600 16 Q630 2 660 22 Q690 38 720 12 Q750 0 780 24 Q810 36 840 14 Q870 2 900 20 Q930 38 960 10 Q990 0 1020 22 Q1050 36 1080 16 Q1110 2 1140 24 Q1170 38 1200 14 L1200 40 L0 40 Z"
            fill="#FEFCF9"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Decorative divider */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-kraft" />
          <div className="h-2 w-2 rotate-45 border border-kraft" />
          <div className="h-px w-12 bg-kraft" />
        </div>

        <p className="font-handwritten text-xl text-terracotta md:text-2xl">
          ready to explore?
        </p>

        <h2 className="mt-4 font-serif text-3xl font-bold text-espresso md:text-5xl">
          Bring Italy Home
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-espresso/60 md:text-lg">
          Browse our full collection of hand-selected Italian imports. From
          everyday pantry staples to rare artisan finds — your perfect Italian
          kitchen awaits.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 rounded-sm bg-primary px-8 py-4 font-serif text-lg font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
          >
            Visit Our Shop
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Small note */}
        <p className="mt-6 font-handwritten text-sm text-espresso/40">
          Free shipping on orders over $75 ✦ Satisfaction guaranteed
        </p>

        {/* Bottom divider */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-kraft" />
          <div className="h-2 w-2 rotate-45 border border-kraft" />
          <div className="h-px w-12 bg-kraft" />
        </div>
      </div>
    </section>
  );
};

export default ScrapbookCTA;
