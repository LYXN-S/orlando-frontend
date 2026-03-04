import React, { useEffect, useRef } from 'react';

const stories = [
  {
    title: 'Where It All Began',
    text: `It started with a single bottle of olive oil — golden, peppery, unlike anything found on supermarket shelves. A family trip to the Puglia countryside in the south of Italy opened our eyes to a world of flavors that simply didn't exist back home. We knew right then that these treasures deserved a wider audience.`,
    imageAlt: 'Olive groves in Puglia',
    imagePlaceholder: '🫒',
    rotation: 'rotate-2',
  },
  {
    title: 'Our Promise to You',
    text: `Every product on our shelves has been personally tasted, tested, and approved. We visit the farms, shake hands with the producers, and hear the stories behind each jar of sauce, every wheel of cheese, and each bag of handmade pasta. No shortcuts, no mass production — just authentic Italian craftsmanship.`,
    imageAlt: 'Artisan pasta making',
    imagePlaceholder: '🍝',
    rotation: '-rotate-2',
  },
  {
    title: 'More Than a Store',
    text: `Orlando Prestige isn't just an import business — it's a bridge between Italian farming families and food lovers everywhere. When you choose our products, you're supporting generations of tradition, sustainable farming, and the kind of quality that only comes from genuine passion for the craft.`,
    imageAlt: 'Italian countryside',
    imagePlaceholder: '🌿',
    rotation: 'rotate-1',
  },
];

const PolaroidImage = ({ story, className = '' }) => (
  <div
    className={`inline-block bg-white p-3 pb-12 shadow-lg transition-transform duration-300 hover:scale-105 ${story.rotation} ${className}`}
    style={{
      boxShadow:
        '2px 3px 12px rgba(45,31,20,0.12), 0 1px 3px rgba(45,31,20,0.08)',
    }}
  >
    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-linen to-aged-paper md:h-64">
      <span className="text-6xl md:text-7xl">{story.imagePlaceholder}</span>
    </div>
    <p className="mt-1 text-center font-handwritten text-sm text-primary/50">
      {story.imageAlt}
    </p>
  </div>
);

const FadeInSection = ({ children, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

const OurStory = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* Section heading */}
      <div className="mx-auto mb-16 max-w-7xl px-6 text-center md:mb-24">
        <FadeInSection>
          <p className="font-handwritten text-xl text-terracotta">
            a little about us
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-espresso md:text-5xl">
            Our Story
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-kraft" />
            <div className="h-1.5 w-1.5 rotate-45 bg-terracotta/40" />
            <div className="h-px w-16 bg-kraft" />
          </div>
        </FadeInSection>
      </div>

      {/* Story blocks — alternating layout */}
      <div className="mx-auto max-w-6xl space-y-20 px-6 md:space-y-32">
        {stories.map((story, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <FadeInSection key={i}>
              <div
                className={`flex flex-col items-center gap-8 md:flex-row md:gap-16 ${
                  isReversed ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Polaroid image */}
                <div className="flex-shrink-0">
                  <PolaroidImage story={story} className="w-56 md:w-72" />
                </div>

                {/* Text content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-serif text-2xl font-bold text-espresso md:text-3xl">
                    {story.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-espresso/60 md:text-lg">
                    {story.text}
                  </p>
                </div>
              </div>
            </FadeInSection>
          );
        })}
      </div>

      {/* Decorative paper clip */}
      <div className="absolute right-4 top-24 hidden text-kraft/30 lg:block">
        <svg
          width="40"
          height="80"
          viewBox="0 0 40 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M20 0 V70 Q20 78 12 78 Q4 78 4 70 V15 Q4 7 12 7 Q20 7 20 15 V60" />
        </svg>
      </div>
    </section>
  );
};

export default OurStory;
