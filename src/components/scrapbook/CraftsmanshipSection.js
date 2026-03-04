import React from 'react';

const CraftsmanshipSection = () => {
  return (
    <section className="relative overflow-hidden bg-espresso py-24 md:py-36">
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-terracotta/10" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Decorative element — top */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-kraft/40" />
          <div className="h-2 w-2 rotate-45 border border-kraft/40" />
          <div className="h-px w-12 bg-kraft/40" />
        </div>

        <p className="font-handwritten text-xl text-terracotta/80 md:text-2xl">
          the art of quality
        </p>

        <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Crafted with
          <br />
          <span className="text-kraft">Generations of Care</span>
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          Every jar, every bottle, every package tells a story of dedication.
          Our producers use time-honored methods passed down through
          generations — hand-harvesting olives at peak ripeness, slow-drying
          pasta on wooden racks, and aging cheeses in centuries-old cellars.
        </p>

        {/* Material highlights */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-10">
          {[
            {
              icon: '🫒',
              title: 'Cold-Pressed Oils',
              desc: 'First press, single estate olive oils from Puglia & Calabria',
            },
            {
              icon: '🌾',
              title: 'Bronze-Cut Pasta',
              desc: 'Slow-dried artisan pasta with perfect texture & bite',
            },
            {
              icon: '🍅',
              title: 'Sun-Ripened Produce',
              desc: 'DOP-certified San Marzano tomatoes & Italian preserves',
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Decorative element — bottom */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-kraft/40" />
          <div className="h-2 w-2 rotate-45 border border-kraft/40" />
          <div className="h-px w-12 bg-kraft/40" />
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
