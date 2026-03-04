import React from 'react';
import Footer from '../components/Footer';
import ScrapbookHero from '../components/scrapbook/ScrapbookHero';
import OurStory from '../components/scrapbook/OurStory';
import FeaturedCollection from '../components/scrapbook/FeaturedCollection';
import CraftsmanshipSection from '../components/scrapbook/CraftsmanshipSection';
import TestimonialsSection from '../components/scrapbook/TestimonialsSection';
import ScrapbookCTA from '../components/scrapbook/ScrapbookCTA';

const Home = () => {
  return (
    <div className="min-h-screen">
      <ScrapbookHero />
      <OurStory />
      <FeaturedCollection />
      <CraftsmanshipSection />
      <TestimonialsSection />
      <ScrapbookCTA />
      <Footer />
    </div>
  );
};

export default Home;
