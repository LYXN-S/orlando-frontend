import React from 'react';

const testimonials = [
  {
    name: 'Maria C.',
    location: 'New York, NY',
    quote:
      'The olive oil is absolutely divine — it reminds me of my grandmother\'s kitchen in Napoli. Nothing else compares.',
    rotation: '-rotate-1',
  },
  {
    name: 'James R.',
    location: 'San Francisco, CA',
    quote:
      'I\'ve been cooking Italian food for 20 years, and these ingredients have completely elevated my dishes. My family can tell the difference!',
    rotation: 'rotate-2',
  },
  {
    name: 'Sofia L.',
    location: 'Chicago, IL',
    quote:
      'The pasta is unlike anything from the grocery store. You can taste the craftsmanship in every bite. I\'m a customer for life.',
    rotation: '-rotate-2',
  },
];

const PostcardTestimonial = ({ testimonial }) => (
  <div
    className={`relative bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-105 md:p-8 ${testimonial.rotation}`}
    style={{
      boxShadow:
        '3px 4px 16px rgba(45,31,20,0.1), 0 1px 4px rgba(45,31,20,0.06)',
      backgroundImage: `
        linear-gradient(to bottom, transparent 95%, rgba(196,167,125,0.1) 100%),
        repeating-linear-gradient(transparent, transparent 27px, rgba(196,167,125,0.15) 27px, rgba(196,167,125,0.15) 28px)
      `,
    }}
  >
    {/* Postcard stamp area */}
    <div className="absolute right-3 top-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-dashed border-terracotta/30">
        <span className="text-xs text-terracotta/40">✦</span>
      </div>
    </div>

    {/* Quote */}
    <p className="mb-6 pr-12 font-handwritten text-lg leading-relaxed text-espresso/70 md:text-xl">
      "{testimonial.quote}"
    </p>

    {/* Signature line */}
    <div className="border-t border-kraft/30 pt-3">
      <p className="font-handwritten text-base font-bold text-primary">
        — {testimonial.name}
      </p>
      <p className="font-handwritten text-sm text-espresso/40">
        {testimonial.location}
      </p>
    </div>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="relative overflow-hidden bg-linen py-20 md:py-32">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <p className="font-handwritten text-xl text-terracotta">
            what our customers say
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-espresso md:text-5xl">
            Love Letters
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-kraft" />
            <div className="h-1.5 w-1.5 rotate-45 bg-terracotta/40" />
            <div className="h-px w-16 bg-kraft" />
          </div>
        </div>

        {/* Testimonial postcards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {testimonials.map((t, i) => (
            <PostcardTestimonial key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
