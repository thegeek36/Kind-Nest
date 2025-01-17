import React, { Suspense } from 'react';

// Dynamically import components
const Navbar = React.lazy(() => import('../components/Navbar'));
const Hero = React.lazy(() => import('../components/Hero'));
const About = React.lazy(() => import('../components/About'));
const Gallery = React.lazy(() => import('../components/Gallery'));
const WhatWeDo = React.lazy(() => import('../components/WhatWeDo'));
const Donate = React.lazy(() => import('../components/Donate'));
const Contact = React.lazy(() => import('../components/Contact'));

const Home = () => {
  return (
    <div className="w-full">
      <Suspense fallback={<div>Loading...</div>}>
        {/* NavBar Section */}
        <section id="navbar" className="fixed top-0 left-0 w-full z-10">
          <Navbar />
        </section>

        {/* Hero Section */}
        <section id="hero" className="relative z-0 pt-24">
          <Hero />
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50">
          <About />
        </section>

        <section id="gallery" className="py-20">
          <Gallery />
        </section>
        {/* What We Do Section */}
        <section id="what-we-do" className="py-20">
          <WhatWeDo />
        </section>

        {/* Donate Section */}
        <section id="donate" className="py-20">
          <Donate />
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50">
          <Contact />
        </section>
      </Suspense>
    </div>
  );
};

export default Home;
