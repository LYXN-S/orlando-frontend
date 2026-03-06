import React from 'react';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>Orlando Prestige — Premium Italian Imports</title>
        <meta name="description" content="Authentic Italian flavors delivered to your door. Premium Mediterranean products sourced directly from Italian farms and producers — olive oils, artisan pastas, wines, and more." />
        <meta property="og:title" content="Orlando Prestige — Premium Italian Imports" />
        <meta property="og:description" content="Curating the finest Mediterranean flavors from Italy's most dedicated producers." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
      </Helmet>
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
